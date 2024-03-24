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

// RegisterRoutes registers the routes for version 1
func RegisterRoutes(g *echo.Group, app *Application) {
	g.GET("/healthcheck", app.HealthCheck)
	g.GET("/snapshots", app.GetAllSnapshotsHandler)
	g.GET("/snapshots/:slug/summary", app.GetSnapshotSummaryBySlugHandler)
	g.GET("/snapshots/:slug", app.GetAllSnapshotsBySlugHandler)
}
