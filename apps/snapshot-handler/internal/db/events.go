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

const measurementNameEvents string = "events"

func (service *DBService) QueryAllEvents() ([]domain.Event, error) {
	fluxQuery := fmt.Sprintf(`
from(bucket: "%s")
  |> range(start: -1y)
  |> filter(fn: (r) => r._measurement == "%s")
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> sort(columns: ["_time"], desc: true)`, service.bucket, measurementNameEvents)

	result, err := service.QueryData(fluxQuery)
	if err != nil {
		return nil, err
	}
	defer result.Close()

	events := []domain.Event{}
	for result.Next() {
		event, err := service.ConvertRecordToEvent(*result.Record())
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if result.Err() != nil {
		return nil, result.Err()
	}

	return events, nil
}

func (service *DBService) QueryEventsBySlug(slug string, from, to time.Time, n uint, desc string) ([]domain.Event, error) {
	fluxQuery := fmt.Sprintf(`
    import "date"
    from(bucket: "%s")
      |> range(start: %s, stop: %s)
      |> filter(fn: (r) => r._measurement == "%s" and r.slug == "%s")
      |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"], desc: %s)
      |> limit(n: %d)`, service.bucket, from.Format(time.RFC3339), to.Format(time.RFC3339), measurementNameEvents, slug, desc, n)

	result, err := service.QueryData(fluxQuery)
	if err != nil {
		return nil, err
	}
	defer result.Close()

	events := []domain.Event{}
	for result.Next() {
		event, err := service.ConvertRecordToEvent(*result.Record())
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if result.Err() != nil {
		return nil, result.Err()
	}

	return events, nil
}

func (service *DBService) WriteEvent(event domain.Event) error {
	point, err := service.ConvertEventToInfluxDBPoint(&event, measurementNameEvents)

	if err != nil {
		service.logger.Printf("Failed to convert event to a influxdb point: %v", err)
		return err
	}

	// Use the writeAPI to write the point to InfluxDB
	if err = service.writeAPI.WritePoint(context.Background(), point); err != nil {
		log.Printf("Failed to write point to InfluxDB: %v", err)
		return err
	}

	return nil
}

func (service *DBService) QueryEvents(query string) ([]domain.Event, error) {
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

	return []domain.Event{}, nil
}

func (service *DBService) ConvertEventToInfluxDBPoint(e *domain.Event, measurementName string) (*write.Point, error) {
	parsedTime, err := time.ParseInLocation("2006-01-02 15:04:05", e.Timestamp, service.location)
	if err != nil {
		return nil, err
	}

	point := influxdb2.NewPointWithMeasurement(measurementName).
		AddTag("slug", e.Slug).
		AddTag("unit", e.Unit).
		AddField("event_code", e.EventCode).
		SetTime(parsedTime)

	return point, nil
}

func (service *DBService) ConvertResultsToEvent(result *api.QueryTableResult) ([]domain.Event, error) {
	var events []domain.Event
	defer result.Close()

	for result.Next() {
		record := result.Record()
		event, err := service.ConvertRecordToEvent(*record)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if result.Err() != nil {
		return nil, fmt.Errorf("error processing query results: %w", result.Err())
	}

	return events, nil
}

func (service *DBService) ConvertRecordToEvent(record query.FluxRecord) (domain.Event, error) {
	event := domain.Event{
		Slug:      record.ValueByKey("slug").(string),
		Unit:      record.ValueByKey("unit").(string),
		EventCode: record.ValueByKey("event_code").(string),
		Timestamp: record.Time().In(service.location).Format("2006-01-02 15:04:05"),
	}

	return event, nil
}
