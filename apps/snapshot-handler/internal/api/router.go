package api

import (
	"github.com/labstack/echo/v4"
	v1 "github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/api/v1"
)

// RegisterRoutes registers versioned API routes
func RegisterRoutes(e *echo.Echo, app *v1.Application) {
	v1Group := e.Group("/v1")
	v1.RegisterRoutes(v1Group, app)

	// Support old endpoint
	e.GET("/BB.:name", app.OldSnapshotHandler)
}
