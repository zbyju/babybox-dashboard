package db

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
)

// getInitialDuration calculates the optimistic time window.
func getInitialDuration(limit int) time.Duration {
	return (time.Duration(limit) * 10 * time.Minute) + (25 * time.Minute)
}

// getNextDuration calculates the exponential backoff step.
func getNextDuration(current time.Duration) time.Duration {
	return current * 4
}

// GetSnapshotsNearTimestamp determines the strategy based on input.
func (service *DBService) GetSnapshotsNearTimestamp(
	slugs []string,
	targetTime time.Time,
	limit int,
) ([]domain.Snapshot, error) {

	service.logger.Infof("GetSnapshotsNearTimestamp | Target: %s | Limit: %d | Slugs provided: %d", targetTime, limit, len(slugs))

	// Path 1: Fetch All (Optimized)
	if len(slugs) == 0 {
		service.logger.Debug("Slug list empty -> Path 1 (Fetch All Optimized)")
		return service.fetchAllWithBackoff(targetTime, limit)
	}

	// Path 2: Fetch Specific Slugs (Direct Backoff)
	service.logger.Debug("Specific slugs provided -> Path 2 (Direct Backoff)")
	return service.fetchSpecificSlugsWithBackoff(slugs, targetTime, limit, getInitialDuration(limit))
}

// fetchAllWithBackoff handles the "get everything" case.
func (service *DBService) fetchAllWithBackoff(
	targetTime time.Time,
	limit int,
) ([]domain.Snapshot, error) {

	// 1. Get the master list of slugs
	allSlugs, err := service.GetAllSlugs()
	if err != nil {
		service.logger.Errorf("Failed to fetch master slug list: %v", err)
		return nil, fmt.Errorf("failed to get all slugs: %w", err)
	}
	service.logger.Debugf("Master list retrieved: %d total slugs known", len(allSlugs))

	// 2. Try the "Happy Path": Query ALL data in the calculated initial window
	initialWindow := getInitialDuration(limit)
	start := targetTime.Add(-initialWindow)

	service.logger.Debugf("Attempting optimistic fetch (Happy Path) | Window: %s", initialWindow)

	// Passing nil for slugs means "no filter" -> highly efficient scan
	initialResults, err := service.fetchSnapshots(nil, start, targetTime, limit)
	if err != nil {
		service.logger.Errorf("Optimistic fetch failed: %v", err)
		return nil, err
	}
	service.logger.Infof("Optimistic fetch completed | Found: %d total snapshots", len(initialResults))

	// 3. Process results to separate "Complete" vs "Incomplete" slugs
	groupedResults := groupSnapshotsBySlug(initialResults)

	var finalSnapshots []domain.Snapshot
	var missingSlugs []string

	for _, slug := range allSlugs {
		data := groupedResults[slug]
		count := len(data)

		if count >= limit {
			// Case A: We found enough data. Keep it.
			finalSnapshots = append(finalSnapshots, data...)
		} else {
			// Case B: Not enough data (or 0).
			// We DO NOT add the partial data to finalSnapshots.
			// We add the slug to missingSlugs so the backoff handler can fetch the full set.
			missingSlugs = append(missingSlugs, slug)
		}
	}

	// 4. Check completeness
	if len(missingSlugs) == 0 {
		service.logger.Info("All slugs satisfied by optimistic fetch. Returning results.")
		return initialResults, nil // Or finalSnapshots, they are identical here
	}

	// Log details about what is missing
	service.logger.Warnf("Optimistic fetch insufficient. %d slugs are missing data (found < %d snapshots).", len(missingSlugs), limit)
	if len(missingSlugs) <= 10 {
		service.logger.Debugf("Missing slugs: %v", missingSlugs)
	} else {
		service.logger.Debugf("Missing slugs (first 10): %v ...", missingSlugs[:10])
	}

	// 5. Hand off ONLY the missing slugs to the backoff handler.
	// The backoff handler will return the COMPLETE list for these slugs.
	backoffResults, err := service.fetchSpecificSlugsWithBackoff(missingSlugs, targetTime, limit, getNextDuration(initialWindow))
	if err != nil {
		return nil, err
	}

	// 6. Combine valid initial results with the fixed backoff results
	total := len(finalSnapshots) + len(backoffResults)
	service.logger.Infof("Fetch complete (Optimistic + Backoff) | Total Snapshots: %d", total)

	return append(finalSnapshots, backoffResults...), nil
}

// fetchSpecificSlugsWithBackoff implements the exponential backoff strategy.
func (service *DBService) fetchSpecificSlugsWithBackoff(
	slugs []string,
	targetTime time.Time,
	limit int,
	initialDuration time.Duration,
) ([]domain.Snapshot, error) {

	service.logger.Infof("Starting Backoff Loop | Slugs to process: %d", len(slugs))

	resultsMap := make(map[string][]domain.Snapshot)
	missingSlugs := make(map[string]bool)
	for _, s := range slugs {
		missingSlugs[s] = true
	}

	// Initialize window
	currentWindow := initialDuration
	maxWindow := 365 * 24 * time.Hour
	iteration := 1

	for {
		// 1. Prepare list for this iteration
		var currentBatch []string
		for s := range missingSlugs {
			currentBatch = append(currentBatch, s)
		}

		if len(currentBatch) == 0 {
			service.logger.Info("Backoff Loop Exit: All missing slugs satisfied.")
			break
		}

		service.logger.Infof("--- [Backoff Iteration %d] ---", iteration)
		service.logger.Infof("Current Window: %s", currentWindow)
		service.logger.Infof("Searching for %d slugs: %v", len(currentBatch), currentBatch)

		// 2. Query
		start := targetTime.Add(-currentWindow)
		fetched, err := service.fetchSnapshots(currentBatch, start, targetTime, limit)
		if err != nil {
			service.logger.Errorf("[Iter %d] Query failed: %v", iteration, err)
			return nil, err
		}

		service.logger.Debugf("[Iter %d] Query returned %d raw snapshots", iteration, len(fetched))

		// 3. Process
		grouped := groupSnapshotsBySlug(fetched)
		satisfiedInThisLoop := 0
		var newlySatisfied []string

		for slug := range missingSlugs {
			if data, ok := grouped[slug]; ok {
				// Always update with the latest (wider) search result
				resultsMap[slug] = data

				// Log the status for this slug
				if len(data) >= limit {
					delete(missingSlugs, slug)
					satisfiedInThisLoop++
					newlySatisfied = append(newlySatisfied, slug)
					service.logger.Debugf("  -> Slug '%s': SATISFIED (Found %d/%d)", slug, len(data), limit)
				} else {
					service.logger.Debugf("  -> Slug '%s': STILL MISSING (Found %d/%d)", slug, len(data), limit)
				}
			} else {
				service.logger.Debugf("  -> Slug '%s': NO DATA FOUND in this window", slug)
			}
		}

		service.logger.Infof("[Iter %d] Summary: %d slugs satisfied now (%v). %d still missing.",
			iteration, satisfiedInThisLoop, newlySatisfied, len(missingSlugs))

		// 4. Check Exit Conditions
		if len(missingSlugs) == 0 {
			break
		}
		if currentWindow >= maxWindow {
			service.logger.Warnf("Backoff Limit Reached: Stopped at window %s with %d slugs still missing: %v",
				currentWindow, len(missingSlugs), missingSlugs)
			break
		}

		// 5. Expand Window
		nextWindow := getNextDuration(currentWindow)
		currentWindow = min(nextWindow, maxWindow)

		iteration++
	}

	// Flatten results
	var final []domain.Snapshot
	for _, snaps := range resultsMap {
		final = append(final, snaps...)
	}

	service.logger.Infof("Backoff finished. Returning %d total snapshots found in backoff phase.", len(final))
	return final, nil
}

// fetchSnapshots is the low-level Flux query builder.
func (service *DBService) fetchSnapshots(
	slugs []string,
	start, stop time.Time,
	limit int,
) ([]domain.Snapshot, error) {

	service.logger.Debugf("fetchSnapshots called | Range: %s -> %s | Slugs Filter: %d items",
		start.Format(time.RFC3339), stop.Format(time.RFC3339), len(slugs))

	var slugFilter string
	if len(slugs) > 0 {
		// Use JSON formatting to create a Flux-compatible array string: ["A","B","C"]
		// This handles escaping and delimiters automatically.
		slugsJSON, err := json.Marshal(slugs)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal slugs for query: %w", err)
		}

		// Use the `contains` function which is cleaner than regex for lists
		slugFilter = fmt.Sprintf(`|> filter(fn: (r) => contains(value: r["slug"], set: %s))`, string(slugsJSON))
	} else {
		service.logger.Debug("No slugs provided -> Fetching ALL (No filter)")
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
		service.logger.Errorf("InfluxDB Query Error: %v", err)
		return nil, fmt.Errorf("influx query failed: %w", err)
	}

	snapshots, err := service.ConvertResultsToSnapshots(result)
	if err != nil {
		service.logger.Errorf("Result conversion failed: %v", err)
		return nil, err
	}

	service.logger.Debugf("fetchSnapshots success | Parsed %d snapshots", len(snapshots))
	return snapshots, nil
}

func groupSnapshotsBySlug(snaps []domain.Snapshot) map[string][]domain.Snapshot {
	m := make(map[string][]domain.Snapshot)
	for _, s := range snaps {
		m[s.Slug] = append(m[s.Slug], s)
	}
	return m
}
