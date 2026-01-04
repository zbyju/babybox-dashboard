package db

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
)

func (service *DBService) GetSnapshotsNearTimestamp(
	slugs []string,
	targetTime time.Time,
	limit int,
) ([]domain.Snapshot, error) {
	// 1. Build the filter for slugs only if they are provided
	var slugFilter string
	if len(slugs) > 0 {
		var filters []string
		for _, slug := range slugs {
			filters = append(filters, fmt.Sprintf(`r["slug"] == "%s"`, slug))
		}
		// Wraps the filters: |> filter(fn: (r) => r["slug"] == "A" or r["slug"] == "B")
		slugFilter = fmt.Sprintf(`|> filter(fn: (r) => %s)`, strings.Join(filters, " or "))
	}

	// 2. Construct the Flux query
	// We use a 24h window (stop at targetTime) to find the most recent points
	query := fmt.Sprintf(`
		from(bucket: "%s")
			|> range(start: %s, stop: %s) 
			|> filter(fn: (r) => r["_measurement"] == "%s")
			%s
			|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
			|> group(columns: ["slug"])
			|> sort(columns: ["_time"], desc: true)
			|> limit(n: %d)
	`,
		service.bucket,
		targetTime.Add(-24*7*time.Hour).Format(time.RFC3339),
		targetTime.Format(time.RFC3339),
		measurementNameThermal,
		slugFilter,
		limit,
	)

	// 3. Execute query
	result, err := service.queryAPI.Query(context.TODO(), query)
	if err != nil {
		return nil, fmt.Errorf("influx query failed: %w", err)
	}

	return service.ConvertResultsToSnapshots(result)
}
