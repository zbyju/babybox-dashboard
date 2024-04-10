package utils

import (
	"fmt"
	"testing"
	"time"

	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
)

func compareSnapshots(t *testing.T, expected, actual []domain.Snapshot) {
	isBad := false
	if len(expected) != len(actual) {
		isBad = true
		fmt.Printf("Expected %d snapshots, got %d\n", len(expected), len(actual))
	}

	if !isBad {
		for i := range expected {
			if expected[i].Timestamp != actual[i].Timestamp {
				isBad = true
				fmt.Printf(
					"Snapshot at index %d mismatch, timestamp expected: %s | timestamp actual: %s\n",
					i,
					expected[i].Timestamp,
					actual[i].Timestamp,
				)
			}
		}
	}

	if isBad {
		fmt.Printf("Expected: \n")
		for i := range expected {
			fmt.Printf("%s\n", expected[i].Timestamp)
		}

		fmt.Printf("Got: \n")
		for j := range actual {
			fmt.Printf("%s\n", actual[j].Timestamp)
		}
		t.Errorf("Didn't pass")
	}
}

func TestFillGapsBasic(t *testing.T) {
	snapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 15, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)},
	}
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)
	expectedSnapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 15, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 25, 0, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)},
	}

	result := FillGaps(snapshots, "", from, to)

	compareSnapshots(t, expectedSnapshots, result)
}

func TestFillGapsNoFill(t *testing.T) {
	snapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)},
	}
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)

	result := FillGaps(snapshots, "", from, to)

	compareSnapshots(t, snapshots, result)
}

func TestFillGapsMoreComplex(t *testing.T) {
	snapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 25, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 40, 0, 0, time.UTC)},
	}
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 10, 40, 0, 0, time.UTC)
	expectedSnapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 00, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 00, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 25, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 35, 00, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 40, 00, 0, time.UTC)},
	}

	result := FillGaps(snapshots, "", from, to)

	compareSnapshots(t, expectedSnapshots, result)
}

func TestFillGapsMoreComplex2(t *testing.T) {
	snapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 40, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 50, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 0, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 10, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 20, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 30, 0, 0, time.UTC)},
	}
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 12, 0, 0, 0, time.UTC)
	expectedSnapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 00, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 00, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 40, 00, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 50, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 0, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 10, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 20, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 30, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 40, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 11, 50, 00, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 12, 0, 00, 0, time.UTC)},
	}

	result := FillGaps(snapshots, "", from, to)

	compareSnapshots(t, expectedSnapshots, result)
}

func TestFillGapsGapAtEnd(t *testing.T) {
	snapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 0, 0, time.UTC)},
	}
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 10, 35, 0, 0, time.UTC)
	expectedSnapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 00, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)}, // Placeholder
	}

	result := FillGaps(snapshots, "", from, to)

	compareSnapshots(t, expectedSnapshots, result)
}

func TestFillGapsGapAtStart(t *testing.T) {
	snapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 15, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 0, 0, time.UTC)},
	}
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 10, 20, 0, 0, time.UTC)
	expectedSnapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)},  // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 15, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 0, 0, time.UTC)},
	}

	result := FillGaps(snapshots, "", from, to)

	compareSnapshots(t, expectedSnapshots, result)
}

func TestFillGapsGapAtBothEnds(t *testing.T) {
	snapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 40, 0, 0, time.UTC)},
	}
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 11, 0, 0, 0, time.UTC)
	expectedSnapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 20, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 40, 0, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 50, 0, 0, time.UTC)}, // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 11, 0, 0, 0, time.UTC)},  // Placeholder
	}

	result := FillGaps(snapshots, "", from, to)

	compareSnapshots(t, expectedSnapshots, result)
}

func TestFillGapsEmptySlice(t *testing.T) {
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)

	expectedSnapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)},  // Placeholder
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)}, // Placeholder
	} // Empty slice

	result := FillGaps([]domain.Snapshot{}, "", from, to)

	compareSnapshots(t, expectedSnapshots, result)
}

// Lazy

func TestFillGapsLazyBasic(t *testing.T) {
	snapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)},
	}
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)
	expectedSnapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 10, 1, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)},
	}

	result := FillGapsLazy(snapshots, "", from, to)

	compareSnapshots(t, expectedSnapshots, result)
}

func TestFillGapsLazyComplex(t *testing.T) {
	snapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)},
	}
	from := time.Date(2024, time.April, 9, 10, 0, 0, 0, time.UTC)
	to := time.Date(2024, time.April, 9, 12, 0, 0, 0, time.UTC)
	expectedSnapshots := []domain.Snapshot{
		{Timestamp: time.Date(2024, time.April, 9, 10, 0, 1, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 0, 0, time.UTC)},
		{Timestamp: time.Date(2024, time.April, 9, 10, 30, 1, 0, time.UTC)},
	}

	result := FillGapsLazy(snapshots, "", from, to)

	compareSnapshots(t, expectedSnapshots, result)
}
