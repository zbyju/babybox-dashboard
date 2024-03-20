package v1

import (
	"github.com/labstack/echo/v4"
)

type Config struct {
	Version string
	Port    uint16
}

type Application struct {
	Logger echo.Logger
	Config *Config
}

// RegisterRoutes registers the routes for version 1
func RegisterRoutes(g *echo.Group, app *Application) {
	g.GET("/healthcheck", app.HealthCheck)
	// g.GET("/snapshots", GetSnapshots)
	// g.GET("/snapshots/:id", GetSnapshot)
}
