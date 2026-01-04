package v1

import (
	"time"

	"github.com/labstack/echo/v4"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/db"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/rabbitmq"
)

type Config struct {
	Version      string
	Port         uint16
	TimeLocation *time.Location
}

type Application struct {
	Logger    echo.Logger
	Config    *Config
	DBService *db.DBService
	MQService *rabbitmq.Client
}

type APIResponse struct {
	Data     interface{} `json:"data"`
	Metadata Metadata    `json:"metadata"`
}

type Metadata struct {
	Err     bool        `json:"err"`
	Message interface{} `json:"message"`
}

func ReturnOk(data interface{}) APIResponse {
	return APIResponse{Data: data, Metadata: Metadata{Err: false, Message: "Ok"}}
}
func ReturnErr(err interface{}) APIResponse {
	return APIResponse{Metadata: Metadata{Err: true, Message: err}}
}

// RegisterRoutes registers the routes for version 1
func RegisterRoutes(g *echo.Group, app *Application) {
	g.GET("/healthcheck", app.HealthCheck)
	g.GET("/snapshots", app.GetAllSnapshotsHandler)
	g.GET("/snapshots/:slug/weekday", app.GetWeekdayAverageBySlugHandler)
	g.GET("/snapshots/:slug/summary", app.GetSnapshotSummaryBySlugHandler)
	g.GET("/snapshots/near", app.GetNearSnapshots)
	g.GET("/snapshots/:slug", app.GetAllSnapshotsBySlugHandler)

	g.GET("/events", app.GetAllEventsHandler)
	g.GET("/events/:slug", app.GetAllEventsBySlugHandler)
}
