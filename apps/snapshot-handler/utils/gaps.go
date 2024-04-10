package utils

import (
	"slices"
	"time"

	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
)

// IsGap checks if the difference between two timestamps is greater than 10 minutes
func IsGap(t1, t2 time.Time) bool {
	// Calculate difference in minutes
	diff := t2.Sub(t1).Abs().Minutes()
	return diff >= 12
}

// FillGap creates a snapshot with missing information to fill a gap
func FillerSnapshot(template domain.Snapshot, previous time.Time) domain.Snapshot {
	gap := 10 * time.Minute
	return domain.Snapshot{
		Slug:      template.Slug,
		Version:   template.Version,
		Status:    1,
		Timestamp: previous.Add(gap),
	}
}

func addFirst(x []domain.Snapshot, y domain.Snapshot) []domain.Snapshot {
	x = append([]domain.Snapshot{y}, x...)
	return x
}

// FillGaps fills gaps in the slice of snapshots
func FillGaps(snapshots []domain.Snapshot, slug string, from, to time.Time) []domain.Snapshot {
	result := []domain.Snapshot{}

	// Handle empty slice case
	if len(snapshots) == 0 {
		// Generate timestamps for each 10-minute interval from 'from' to 'to'
		for next := from; next.Before(to) || next.Equal(to); next = next.Add(10 * time.Minute) {
			filler := domain.Snapshot{Slug: slug, Status: 1, Timestamp: next} // Set slug to empty or desired default
			result = append(result, filler)
		}
		return result
	}

	// Assumes desc == true when fetching data
	slices.Reverse(snapshots)

	// Existing snapshots case (same logic as before)
	snapshots = addFirst(snapshots, domain.Snapshot{Slug: slug, Status: 1, Timestamp: from})
	snapshots = append(snapshots, domain.Snapshot{Slug: slug, Status: 1, Timestamp: to})

	for i := 0; i < len(snapshots)-1; i++ {
		prev := snapshots[i]
		curr := snapshots[i+1]

		if i > 0 || IsGap(prev.Timestamp, curr.Timestamp) {
			result = append(result, prev)
		}

		// Check for gap between current and previous snapshot
		if IsGap(prev.Timestamp, curr.Timestamp) {
			// Generate timestamps for each missing snapshot (up to gap limit)
			for next := prev.Timestamp.Add(10 * time.Minute); next.Before(curr.Timestamp); next = next.Add(10 * time.Minute) {
				filler := domain.Snapshot{Slug: slug, Status: 1, Timestamp: next} // Set slug to empty or desired default
				result = append(result, filler)
			}

			if last := result[len(result)-1].Timestamp.Add(10 * time.Minute); i == len(snapshots)-2 && (last.Before(to) || last.Equal(to)) {
				filler := domain.Snapshot{Slug: slug, Status: 1, Timestamp: last}
				result = append(result, filler)
			}
		}
	}

	slices.Reverse(snapshots)
	return result
}

func FillGapsLazy(snapshots []domain.Snapshot, slug string, from, to time.Time) []domain.Snapshot {
	result := []domain.Snapshot{}

	// Handle empty slice case
	if len(snapshots) == 0 {
		// Generate timestamps for each 10-minute interval from 'from' to 'to'
		for next := from; next.Before(to) || next.Equal(to); next = next.Add(10 * time.Minute) {
			filler := domain.Snapshot{Slug: slug, Status: 1, Timestamp: next} // Set slug to empty or desired default
			result = append(result, filler)
		}
		return result
	}

	// Assumes desc == true when fetching data
	slices.Reverse(snapshots)

	// Existing snapshots case (same logic as before)
	snapshots = addFirst(snapshots, domain.Snapshot{Slug: slug, Status: 1, Timestamp: from})
	snapshots = append(snapshots, domain.Snapshot{Slug: slug, Status: 1, Timestamp: to})

	for i := 0; i < len(snapshots)-1; i++ {
		prev := snapshots[i]
		curr := snapshots[i+1]

		if i > 0 {
			result = append(result, prev)
		}

		// Check for gap between current and previous snapshot
		if IsGap(prev.Timestamp, curr.Timestamp) {
			// Generate timestamps for each missing snapshot (up to gap limit)
			filler := domain.Snapshot{Slug: slug, Status: 1, Timestamp: prev.Timestamp.Add(1 * time.Second)} // Set slug to empty or desired default
			result = append(result, filler)
		}
	}

	slices.Reverse(snapshots)
	return result
}
