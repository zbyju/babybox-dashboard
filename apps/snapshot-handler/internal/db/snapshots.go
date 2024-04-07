package db

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/influxdata/influxdb-client-go/v2/api/query"
	write "github.com/influxdata/influxdb-client-go/v2/api/write"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
)

const measurementNameThermal string = "thermal_unit_measurement"

func (service *DBService) QueryAllSnapshots() ([]domain.Snapshot, error) {
	fluxQuery := fmt.Sprintf(`
from(bucket: "%s")
  |> range(start: -1y)
  |> filter(fn: (r) => r._measurement == "%s")
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> sort(columns: ["_time"], desc: true)`, service.bucket, measurementNameThermal)

	result, err := service.QueryData(fluxQuery)
	if err != nil {
		return nil, err
	}
	defer result.Close()

	snapshots := []domain.Snapshot{}
	for result.Next() {
		snapshot, err := service.ConvertRecordToSnapshot(*result.Record())
		if err != nil {
			return nil, err
		}
		snapshots = append(snapshots, snapshot)
	}

	if result.Err() != nil {
		return nil, result.Err()
	}

	return snapshots, nil
}

func (service *DBService) QuerySnapshotsBySlug(slug string, from, to time.Time, n uint) ([]domain.Snapshot, error) {
	var fluxQuery string
	if n == 1 {
		fluxQuery = fmt.Sprintf(`
    import "date"
    from(bucket: "%s")
      |> range(start: %s, stop: %s)
      |> filter(fn: (r) => r._measurement == "%s" and r.slug == "%s")
      |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: %d)`, service.bucket, from.Format(time.RFC3339), to.Format(time.RFC3339), measurementNameThermal, slug, n)
	} else {
		fluxQuery = fmt.Sprintf(`
    import "date"
    from(bucket: "%s")
      |> range(start: %s, stop: %s)
      |> filter(fn: (r) => r._measurement == "%s" and r.slug == "%s")
      |> aggregateWindow(every: 10m, fn: last, createEmpty: true)
      |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: %d)`, service.bucket, from.Format(time.RFC3339), to.Format(time.RFC3339), measurementNameThermal, slug, n)

	}

	result, err := service.QueryData(fluxQuery)
	if err != nil {
		return nil, err
	}
	defer result.Close()

	snapshots := []domain.Snapshot{}
	for result.Next() {
		snapshot, err := service.ConvertRecordToSnapshot(*result.Record())
		if err != nil {
			return nil, err
		}
		snapshots = append(snapshots, snapshot)
	}

	if result.Err() != nil {
		return nil, result.Err()
	}

	if len(snapshots) > 1 && snapshots[0].Status == 1 {
		snapshots = snapshots[1:]
	}

	return snapshots, nil
}

func (service *DBService) QuerySnapshotSummaryBySlug(slug string, from, to time.Time) (interface{}, error) {
	queryTemplate := `from(bucket: "%s")
  |> range(start: %s, stop: %s)
  |> filter(fn: (r) => r._measurement == "%s" and r.slug == "%s" and r._field == "%s")
  |> %s()
  |> yield(name: "%s_%s")

  `

	queries := ""

	fields := []string{"temperature_inside", "temperature_outside", "temperature_casing", "temperature_top", "temperature_bottom", "voltage_in", "voltage_battery"}
	aggregations := []string{"min", "mean", "max"}

	for _, field := range fields {
		for _, aggregation := range aggregations {
			query := fmt.Sprintf(queryTemplate, service.bucket, from.Format(time.RFC3339), to.Format(time.RFC3339), measurementNameThermal, slug, field, aggregation, field, aggregation)
			queries += query
		}
	}

	result, err := service.QueryData(queries)
	if err != nil {
		return nil, err
	}
	defer result.Close()

	summaryData := make(map[string]map[string]map[string]interface{})

	for result.Next() {
		record := result.Record()

		name := strings.Split(record.Result(), "_")
		groupName := name[0]
		fieldName := name[1]
		aggrName := name[2]
		if aggrName == "mean" {
			aggrName = "average"
		}
		aggValue := record.Value()

		if _, ok := summaryData[groupName]; !ok {
			summaryData[groupName] = make(map[string]map[string]interface{})
		}
		if _, ok := summaryData[groupName][fieldName]; !ok {
			summaryData[groupName][fieldName] = make(map[string]interface{})
		}
		summaryData[groupName][fieldName][aggrName] = aggValue
	}

	return summaryData, nil
}

func (service *DBService) WriteSnapshot(snapshot domain.Snapshot) error {
	// Convert your domain model (e.g., Snapshot) to an InfluxDB point
	point, err := service.ConvertToInfluxDBPoint(&snapshot, measurementNameThermal)

	if err != nil {
		service.logger.Printf("Failed to convert snapshot to a influxdb point: %v", err)
		return err
	}

	// Use the writeAPI to write the point to InfluxDB
	if err = service.writeAPI.WritePoint(context.Background(), point); err != nil {
		log.Printf("Failed to write point to InfluxDB: %v", err)
		return err
	}

	return nil
}

func (service *DBService) QueryData(fluxQuery string) (*api.QueryTableResult, error) {
	// Execute the Flux query
	result, err := service.queryAPI.Query(context.Background(), fluxQuery)
	if err != nil {
		// If there's an error executing the query, return the error
		return nil, err
	}

	// It's important for the caller to handle the closing of the result,
	// usually with a defer statement, to ensure resources are released properly.
	return result, nil
}

func (service *DBService) QuerySnapshots(query string) ([]domain.Snapshot, error) {
	// Use the queryAPI to execute a query
	result, err := service.queryAPI.Query(context.Background(), query)
	if err != nil {
		log.Printf("Failed to query InfluxDB: %v", err)
		return nil, err
	}
	defer result.Close()

	// Check for an error
	if result.Err() != nil {
		return nil, fmt.Errorf("query parsing error: %w", result.Err())
	}

	return []domain.Snapshot{}, nil
}

func (service *DBService) ConvertToInfluxDBPoint(s *domain.Snapshot, measurementName string) (*write.Point, error) {
	parsedTime, err := time.ParseInLocation("2006-01-02 15:04:05", s.Timestamp, service.location)
	if err != nil {
		return nil, err
	}

	point := influxdb2.NewPointWithMeasurement(measurementName).
		AddTag("slug", s.Slug).
		AddTag("version", fmt.Sprintf("%d", s.Version)).
		AddField("temperature_inside", *s.Temperature.Inside).
		AddField("temperature_outside", *s.Temperature.Outside).
		AddField("temperature_casing", *s.Temperature.Casing).
		AddField("temperature_top", *s.Temperature.Top).
		AddField("temperature_bottom", *s.Temperature.Bottom).
		AddField("voltage_in", *s.Voltage.In).
		AddField("voltage_battery", *s.Voltage.Battery).
		SetTime(parsedTime)

	return point, nil
}

func (service *DBService) ConvertResultsToSnapshots(result *api.QueryTableResult) ([]domain.Snapshot, error) {
	var snapshots []domain.Snapshot
	defer result.Close()

	for result.Next() {
		record := result.Record()
		snapshot, err := service.ConvertRecordToSnapshot(*record)
		if err != nil {
			return nil, err
		}
		snapshots = append(snapshots, snapshot)
	}

	if result.Err() != nil {
		return nil, fmt.Errorf("error processing query results: %w", result.Err())
	}

	return snapshots, nil
}

func float64PointerFromRecord(record query.FluxRecord, key string) *float64 {
	if val, ok := record.Values()[key]; ok && val != nil {
		if numVal, ok := val.(float64); ok {
			return &numVal
		}
	}
	return nil
}

func (service *DBService) ConvertRecordToSnapshot(record query.FluxRecord) (domain.Snapshot, error) {
	snapshot := domain.Snapshot{
		Slug:      record.ValueByKey("slug").(string),
		Timestamp: record.Time().In(service.location).Format("2006-01-02 15:04:05"),
	}
	snapshot.Temperature.Inside = float64PointerFromRecord(record, "temperature_inside")
	snapshot.Temperature.Outside = float64PointerFromRecord(record, "temperature_outside")
	snapshot.Temperature.Casing = float64PointerFromRecord(record, "temperature_casing")
	snapshot.Temperature.Top = float64PointerFromRecord(record, "temperature_top")
	snapshot.Temperature.Bottom = float64PointerFromRecord(record, "temperature_bottom")

	snapshot.Voltage.In = float64PointerFromRecord(record, "voltage_in")
	snapshot.Voltage.Battery = float64PointerFromRecord(record, "voltage_battery")

	if snapshot.Temperature.Inside == nil ||
		snapshot.Temperature.Outside == nil ||
		snapshot.Temperature.Casing == nil ||
		snapshot.Temperature.Top == nil ||
		snapshot.Temperature.Bottom == nil ||
		snapshot.Voltage.In == nil ||
		snapshot.Voltage.Battery == nil {
		snapshot.Status = snapshot.Status | 1
	}

	return snapshot, nil
}
