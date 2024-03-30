package v1

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// HealthCheck handles the "/v1/healthcheck" route
func (app *Application) HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "up", "version": app.Config.Version})
}
