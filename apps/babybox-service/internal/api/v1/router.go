package v1

import (
	"time"

	"github.com/labstack/echo/v4"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/db"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/rabbitmq"
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
	g.POST("/babyboxes", app.CreateBabybox)
	g.GET("/babyboxes", app.GetAllBabyboxesNames)
	g.GET("/babyboxes/:slug", app.GetBabyboxBySlug)
	g.PUT("/babyboxes/:slug", app.UpdateBabybox)

	g.POST("/issues", app.CreateIssue)
	g.GET("/issues", app.GetAllIssues)
	g.GET("/issues/unsolved", app.GetIssuesUnsolved)
	g.GET("/issues/unsolved/:slug", app.GetIssuesUnsolvedBySlug)
	g.GET("/issues/username/:username", app.GetIssuesByUsername)
	g.GET("/issues/:slug", app.GetIssuesBySlug)
	g.PUT("/issues/:id", app.UpdateIssue)

	g.POST("/maintenances", app.CreateMaintenance)
	g.GET("/maintenances", app.GetAllMaintenances)
	g.GET("/maintenances/:slug", app.GetMaintenancesBySlug)
}
