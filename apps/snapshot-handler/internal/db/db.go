package db

import (
	"fmt"
	"log"
	"os"
	"time"

	api "github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/labstack/echo/v4"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
)

type DBService struct {
	client   influxdb2.Client
	writeAPI api.WriteAPIBlocking
	queryAPI api.QueryAPI

	org    string
	bucket string

	logger   echo.Logger
	location *time.Location
}

func InitConnection(logger *echo.Logger, location *time.Location) (*DBService, error) {
	influxDBURL := os.Getenv("INFLUXDB_URL")
	influxDBToken := os.Getenv("INFLUXDB_TOKEN")
	influxDBOrg := os.Getenv("INFLUXDB_ORG")
	influxDBBucket := os.Getenv("INFLUXDB_BUCKET")

	if influxDBURL == "" || influxDBToken == "" || influxDBOrg == "" || influxDBBucket == "" {
		log.Printf("One or more required environment variables are missing (URL='%s' | token='%s' | org='%s' | bucket='%s')\n", influxDBURL, influxDBToken, influxDBOrg, influxDBBucket)
		return nil, fmt.Errorf("missing environment variables for InfluxDB connection")
	}

	client := influxdb2.NewClient(influxDBURL, influxDBToken)
	writeAPI := client.WriteAPIBlocking(influxDBOrg, influxDBBucket)
	queryAPI := client.QueryAPI(influxDBOrg)

	service := &DBService{
		client:   client,
		writeAPI: writeAPI,
		queryAPI: queryAPI,

		org:    influxDBOrg,
		bucket: influxDBBucket,

		logger:   *logger,
		location: location,
	}

	return service, nil
}
