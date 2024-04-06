package v1

import (
	"log"
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
	log.Println("New snapshot incoming")
	app.Logger.Info("test\n")
	app.Logger.Warn("test\n")
	app.Logger.Error("test\n")

	// Directly parse temperature and voltage values based on the T0-T7 mapping
	temperature := domain.Temperature{
		Outside: parseQueryParam(app, c, "T0") / 100,
		Inside:  parseQueryParam(app, c, "T1") / 100,
		Bottom:  parseQueryParam(app, c, "T2") / 100,
		Top:     parseQueryParam(app, c, "T3") / 100,
		Casing:  parseQueryParam(app, c, "T7") / 100,
	}

	voltage := domain.Voltage{
		In:      parseQueryParam(app, c, "T4") / 100,
		Battery: parseQueryParam(app, c, "T5") / 100,
	}

	// Create the Snapshot object
	snapshot := domain.Snapshot{
		Slug:        slug,
		Temperature: temperature,
		Voltage:     voltage,
		Version:     1,
		Timestamp:   time.Now().In(app.Config.TimeLocation).Format("2006-01-02 15:04:05"),
	}

	err := app.DBService.WriteSnapshot(snapshot)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err.Error()))
	}

	log.Printf("Trying to publish a new snapshot: %+v\n", snapshot)
	err = app.MQService.PublishSnapshot(snapshot)
	if err != nil {
		app.Logger.Warnf("Couldn't publish snapshot to RabbitMQ - %s", err)
	}

	return c.JSON(http.StatusOK, ReturnOk(snapshot))
}

func (app *Application) GetAllSnapshotsHandler(c echo.Context) error {
	snapshots, err := app.DBService.QueryAllSnapshots()
	if err != nil {
		// Log the error and return an appropriate error response
		app.Logger.Error("Failed to query all snapshots: ", err)
		return c.JSON(http.StatusInternalServerError, ReturnErr("Failed to fetch snapshots"))
	}

	return c.JSON(http.StatusOK, ReturnOk(snapshots))
}

func (app *Application) GetAllSnapshotsBySlugHandler(c echo.Context) error {
	slug := c.Param("slug")
	from := c.QueryParam("from")
	to := c.QueryParam("to")
	n := c.QueryParam("n")

	if from == "" {
		from = time.Now().AddDate(-1, 0, 0).Format("2006-01-02") // One year ago
	}
	if to == "" {
		to = time.Now().Format("2006-01-02") // Today
	}
	if n == "" {
		n = "99999999"
	}

	// Parse the dates from the query parameters
	fromTime, err := time.Parse("2006-01-02", from)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ReturnErr("Invalid 'from' date format"))
	}
	toTime, err := time.Parse("2006-01-02", to)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ReturnErr("Invalid 'to' date format"))
	}
	nNum, err := strconv.Atoi(n)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ReturnErr("'n' is not a number"))
	}

	// Adjust 'toTime' to the end of the day if you want the 'to' date to be inclusive
	toTime = toTime.Add(24 * time.Hour)

	snapshots, err := app.DBService.QuerySnapshotsBySlug(slug, fromTime, toTime, uint(nNum))
	if err != nil {
		// Log the error and return an appropriate error response
		app.Logger.Error("Failed to query all snapshots: ", err)
		return c.JSON(http.StatusInternalServerError, ReturnErr("Failed to fetch snapshots"))
	}

	return c.JSON(http.StatusOK, ReturnOk(snapshots))
}

func (app *Application) GetSnapshotSummaryBySlugHandler(c echo.Context) error {
	slug := c.Param("slug")
	from := c.QueryParam("from")
	to := c.QueryParam("to")

	if from == "" {
		from = time.Now().AddDate(-1, 0, 0).Format("2006-01-02") // One year ago
	}
	if to == "" {
		to = time.Now().Format("2006-01-02") // Today
	}

	// Parse the dates from the query parameters
	fromTime, err := time.Parse("2006-01-02", from)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ReturnErr("Invalid 'from' date format"))
	}
	toTime, err := time.Parse("2006-01-02", to)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ReturnErr("Invalid 'to' date format"))
	}
	// Adjust 'toTime' to the end of the day if you want the 'to' date to be inclusive
	toTime = toTime.Add(24 * time.Hour)

	snapshots, err := app.DBService.QuerySnapshotSummaryBySlug(slug, fromTime, toTime)
	if err != nil {
		// Log the error and return an appropriate error response
		app.Logger.Error("Failed to query all snapshots: ", err)
		return c.JSON(http.StatusInternalServerError, ReturnErr("Failed to fetch snapshots"))
	}

	return c.JSON(http.StatusOK, ReturnOk(snapshots))
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
