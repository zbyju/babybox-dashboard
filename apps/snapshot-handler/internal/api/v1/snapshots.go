package v1

import (
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/utils"
)

// Old snapshot handler
func (app *Application) OldSnapshotHandler(c echo.Context) error {
	slug := utils.ToSlug(c.QueryParam("BB"))

	// Directly parse temperature and voltage values based on the T0-T7 mapping
	temperatures := domain.Temperatures{
		Outside: parseQueryParam(app, c, "T0"),
		Inside:  parseQueryParam(app, c, "T1"),
		Bottom:  parseQueryParam(app, c, "T2"),
		Top:     parseQueryParam(app, c, "T3"),
		Casing:  parseQueryParam(app, c, "T7"),
	}

	voltages := domain.Voltages{
		In:      parseQueryParam(app, c, "T4"),
		Battery: parseQueryParam(app, c, "T5"),
	}

	// Create the Snapshot object
	snapshot := domain.Snapshot{
		Slug:         slug,
		Temperatures: temperatures,
		Voltages:     voltages,
		Version:      1,
		Timestamp:    time.Now().Format("2006-01-02 15:04:05"),
	}

	return c.JSON(http.StatusOK, snapshot)
}

func parseQueryParam(app *Application, c echo.Context, param string) float64 {
	valueStr := c.QueryParam(param)
	value, err := strconv.ParseFloat(valueStr, 64)
	if err != nil {
		// Handle the error. For this example, we'll just log it and use 0 as the default value
		app.Logger.Errorf("Error parsing parameter %s: %v | for URL: %s", param, err, c.Request().URL.String())
		return 0
	}
	return value
}
