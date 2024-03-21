package db

import (
	"context"
	"fmt"
	"log"
	"time"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/influxdata/influxdb-client-go/v2/api/query"
	write "github.com/influxdata/influxdb-client-go/v2/api/write"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
)

const measurementName string = "thermal_unit_measurement"

func (service *DBService) QueryAllSnapshots() ([]domain.Snapshot, error) {
	fluxQuery := fmt.Sprintf(`
from(bucket: "%s")
  |> range(start: -1y)
  |> filter(fn: (r) => r._measurement == "%s")
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> sort(columns: ["_time"], desc: true)`, service.bucket, measurementName)

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
	fluxQuery := fmt.Sprintf(`
from(bucket: "%s")
  |> range(start: %s, stop: %s)
  |> filter(fn: (r) => r._measurement == "%s" and r.slug == "%s")
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> sort(columns: ["_time"], desc: true)
  |> limit(n: %d)`, service.bucket, from.Format(time.RFC3339), to.Format(time.RFC3339), measurementName, slug, n)

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

func (service *DBService) WriteSnapshot(snapshot domain.Snapshot) error {
	// Convert your domain model (e.g., Snapshot) to an InfluxDB point
	point, err := service.ConvertToInfluxDBPoint(&snapshot, measurementName)

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
		AddField("temperature_inside", s.Temperatures.Inside).
		AddField("temperature_outside", s.Temperatures.Outside).
		AddField("temperature_casing", s.Temperatures.Casing).
		AddField("temperature_top", s.Temperatures.Top).
		AddField("temperature_bottom", s.Temperatures.Bottom).
		AddField("voltage_in", s.Voltages.In).
		AddField("voltage_battery", s.Voltages.Battery).
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

func (service *DBService) ConvertRecordToSnapshot(record query.FluxRecord) (domain.Snapshot, error) {
	snapshot := domain.Snapshot{
		Slug: record.ValueByKey("slug").(string),
		Temperatures: domain.Temperatures{
			Inside:  record.ValueByKey("temperature_inside").(float64),
			Outside: record.ValueByKey("temperature_outside").(float64),
			Casing:  record.ValueByKey("temperature_casing").(float64),
			Top:     record.ValueByKey("temperature_top").(float64),
			Bottom:  record.ValueByKey("temperature_bottom").(float64),
		},
		Voltages: domain.Voltages{
			In:      record.ValueByKey("voltage_in").(float64),
			Battery: record.ValueByKey("voltage_battery").(float64),
		},
		Timestamp: record.Time().In(service.location).Format("2006-01-02 15:04:05"),
	}

	return snapshot, nil
}
