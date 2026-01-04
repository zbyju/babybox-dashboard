package db

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"time"

	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
)

// --- Shared Helpers ---

func getInitialDuration(limit int) time.Duration {
	return (time.Duration(limit) * 10 * time.Minute) + (25 * time.Minute)
}

func getNextDuration(current time.Duration) time.Duration {
	return current * 4
}

func minTime(a, b time.Time) time.Time {
	if a.Before(b) {
		return a
	}
	return b
}

// --- Main Service Logic ---

func (service *DBService) GetSnapshotsNearTimestamp(
	slugs []string,
	targetTime time.Time,
	limit int,
) ([]domain.Snapshot, error) {

	// 1. Resolve Slugs
	// If no slugs provided, we must fetch the master list to calculate upper bounds.
	if len(slugs) == 0 {
		var err error
		slugs, err = service.GetAllSlugs()
		if err != nil {
			return nil, fmt.Errorf("failed to fetch all slugs: %w", err)
		}
		service.logger.Debugf("Resolved %d total slugs from DB", len(slugs))
	}

	service.logger.Infof("GetSnapshotsNearTimestamp | Target: %s | Slugs: %d", targetTime, len(slugs))

	// 2. Create Map: Slug -> UpperBound
	// UpperBound = min(targetTime, lastSeenTime)
	upperBoundMap, err := service.getSlugUpperBounds(slugs, targetTime)
	if err != nil {
		return nil, fmt.Errorf("failed to determine slug upper bounds: %w", err)
	}

	// 3. Create Batches
	// Group slugs that are temporally close (within 24h) to minimize queries.
	batches := service.createBatches(upperBoundMap)
	service.logger.Infof("Created %d query batches from %d slugs", len(batches), len(slugs))

	// 4. Execute Batches
	var finalResults []domain.Snapshot

	for i, batch := range batches {
		service.logger.Debugf("Batch %d/%d | Anchor Time: %s | Slugs: %d", i+1, len(batches), batch.AnchorTime, len(batch.Slugs))

		results, err := service.fetchSpecificSlugsWithBackoff(batch.Slugs, batch.AnchorTime, limit)
		if err != nil {
			return nil, err
		}
		finalResults = append(finalResults, results...)
	}

	return finalResults, nil
}

// Batch represents a group of slugs that will be queried together
type Batch struct {
	AnchorTime time.Time // The max upper bound for this group
	Slugs      []string
}

// createBatches groups slugs so that their upper bounds are within 1 day of the group's max.
func (service *DBService) createBatches(upperBounds map[string]time.Time) []Batch {
	// 1. Invert map to group by exact timestamp first
	timeToSlugs := make(map[time.Time][]string)
	var uniqueTimes []time.Time

	for slug, bound := range upperBounds {
		if _, exists := timeToSlugs[bound]; !exists {
			uniqueTimes = append(uniqueTimes, bound)
		}
		timeToSlugs[bound] = append(timeToSlugs[bound], slug)
	}

	// 2. Sort times descending (Newest -> Oldest)
	sort.Slice(uniqueTimes, func(i, j int) bool {
		return uniqueTimes[i].After(uniqueTimes[j])
	})

	// 3. Greedy Clustering (1 Day Window)
	var batches []Batch

	// We iterate through sorted times.
	// processedIndices keeps track of times we've already bundled into a batch.
	processed := make([]bool, len(uniqueTimes))

	for i := 0; i < len(uniqueTimes); i++ {
		if processed[i] {
			continue
		}

		// Start a new batch with this time as the Anchor (Max)
		anchor := uniqueTimes[i]
		currentBatchSlugs := make([]string, 0)

		// Add slugs from the anchor time
		currentBatchSlugs = append(currentBatchSlugs, timeToSlugs[anchor]...)
		processed[i] = true

		// Look ahead for other times that fit within [anchor - 24h, anchor]
		cutoff := anchor.Add(-24 * time.Hour)

		for j := i + 1; j < len(uniqueTimes); j++ {
			if processed[j] {
				continue
			}

			t := uniqueTimes[j]
			// Since times are sorted descending, if t is before cutoff,
			// all subsequent times are also before cutoff (too old for this batch).
			if t.Before(cutoff) {
				break
			}

			// It fits in the batch!
			currentBatchSlugs = append(currentBatchSlugs, timeToSlugs[t]...)
			processed[j] = true
		}

		batches = append(batches, Batch{
			AnchorTime: anchor,
			Slugs:      currentBatchSlugs,
		})
	}

	return batches
}

// fetchSpecificSlugsWithBackoff executes the iterative query strategy for a specific batch.
func (service *DBService) fetchSpecificSlugsWithBackoff(
	slugs []string,
	anchorTime time.Time,
	limit int,
) ([]domain.Snapshot, error) {

	resultsMap := make(map[string][]domain.Snapshot)
	missingSlugs := make(map[string]bool)
	for _, s := range slugs {
		missingSlugs[s] = true
	}

	// Logic: Start window is calculated normally.
	// We expand backwards from AnchorTime.
	currentWindow := getInitialDuration(limit)
	maxWindow := 365 * 24 * time.Hour
	iteration := 1

	for {
		// 1. Identify missing for this iteration
		var batchSlugs []string
		for s := range missingSlugs {
			batchSlugs = append(batchSlugs, s)
		}
		if len(batchSlugs) == 0 {
			break
		}

		// 2. Query
		start := anchorTime.Add(-currentWindow)

		service.logger.Debugf("   [Iter %d] Window: %s | Range: %s -> %s", iteration, currentWindow, start, anchorTime)

		fetched, err := service.fetchSnapshots(batchSlugs, start, anchorTime, limit)
		if err != nil {
			return nil, err
		}

		// 3. Process
		grouped := groupSnapshotsBySlug(fetched)

		for slug := range missingSlugs {
			if data, ok := grouped[slug]; ok {
				resultsMap[slug] = data
				if len(data) >= limit {
					delete(missingSlugs, slug)
				}
			}
		}

		// 4. Exit Conditions
		if len(missingSlugs) == 0 {
			break
		}
		if currentWindow >= maxWindow {
			service.logger.Warnf("   [Iter %d] Max window reached. Aborting for %d slugs.", iteration, len(missingSlugs))
			break
		}

		// 5. Expand
		nextWindow := getNextDuration(currentWindow)

		// Optimization: If next window > 100 years (sanity check), cap it
		if nextWindow > maxWindow {
			nextWindow = maxWindow
		}
		currentWindow = nextWindow
		iteration++
	}

	var final []domain.Snapshot
	for _, snaps := range resultsMap {
		final = append(final, snaps...)
	}
	return final, nil
}

// getSlugUpperBounds fetches 'last seen' and returns min(target, lastSeen).
func (service *DBService) getSlugUpperBounds(slugs []string, targetTime time.Time) (map[string]time.Time, error) {
	if len(slugs) == 0 {
		return nil, nil
	}

	// 1. Fetch Last Seen Times
	slugsJSON, _ := json.Marshal(slugs)
	// We look back 1 year for metadata.
	query := fmt.Sprintf(`
		from(bucket: "%s")
			|> range(start: -1y, stop: %s)
			|> filter(fn: (r) => r["_measurement"] == "%s")
			|> filter(fn: (r) => contains(value: r["slug"], set: %s))
			|> group(columns: ["slug"])
			|> last()
	`,
		service.bucket,
		targetTime.Format(time.RFC3339),
		measurementNameThermal,
		string(slugsJSON),
	)

	result, err := service.queryAPI.Query(context.TODO(), query)
	if err != nil {
		return nil, err
	}

	lastSeenMap := make(map[string]time.Time)
	for result.Next() {
		slug, ok := result.Record().ValueByKey("slug").(string)
		if ok {
			lastSeenMap[slug] = result.Record().Time()
		}
	}

	// 2. Map Construction
	bounds := make(map[string]time.Time)
	for _, slug := range slugs {
		if lastSeen, ok := lastSeenMap[slug]; ok {
			// Key Logic: The upper bound is the EARLIER of Target or LastSeen
			bounds[slug] = minTime(targetTime, lastSeen)
		} else {
			// Never seen? Default to target. Backoff will fail naturally.
			bounds[slug] = targetTime
		}
	}

	return bounds, nil
}

// fetchSnapshots (Standard implementation)
func (service *DBService) fetchSnapshots(
	slugs []string,
	start, stop time.Time,
	limit int,
) ([]domain.Snapshot, error) {

	var slugFilter string
	if len(slugs) > 0 {
		slugsJSON, _ := json.Marshal(slugs)
		slugFilter = fmt.Sprintf(`|> filter(fn: (r) => contains(value: r["slug"], set: %s))`, string(slugsJSON))
	}

	query := fmt.Sprintf(`
		from(bucket: "%s")
			|> range(start: %s, stop: %s)
			|> filter(fn: (r) => r["_measurement"] == "%s")
			%s
			|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
			|> group(columns: ["slug"])
			|> tail(n: %d)
	`,
		service.bucket,
		start.Format(time.RFC3339),
		stop.Format(time.RFC3339),
		measurementNameThermal,
		slugFilter,
		limit,
	)

	result, err := service.queryAPI.Query(context.TODO(), query)
	if err != nil {
		return nil, fmt.Errorf("influx query failed: %w", err)
	}

	return service.ConvertResultsToSnapshots(result)
}

func groupSnapshotsBySlug(snaps []domain.Snapshot) map[string][]domain.Snapshot {
	m := make(map[string][]domain.Snapshot)
	for _, s := range snaps {
		m[s.Slug] = append(m[s.Slug], s)
	}
	return m
}
