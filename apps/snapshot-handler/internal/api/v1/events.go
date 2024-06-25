package v1

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/utils"
)

func parseEventCode(code string) (string, string, error) {
	if len(code) != 6 {
		return "", "", fmt.Errorf("invalid event code format")
	}

	unitType := code[0:1] // First character (T or E)
	eventNumber := code[2:]

	var unit string
	switch strings.ToLower(unitType) {
	case "t":
		unit = "thermal"
	case "e":
		unit = "engine"
	default:
		return "", "", fmt.Errorf("invalid unit type")
	}

	return unit, eventNumber, nil
}

func (app *Application) EventsHandler(c echo.Context) error {
	slug := utils.ToSlug(c.Param("slug"))
	eventCode := c.QueryParam("event")

	unit, eventNumber, err := parseEventCode(eventCode)

	if err != nil {
		return c.JSON(http.StatusBadRequest, ReturnErr("Failed to parse event code"))
	}

	event := domain.Event{
		Slug:      slug,
		Unit:      unit,
		EventCode: eventNumber,
		Timestamp: time.Now().In(app.Config.TimeLocation).Format("2006-01-02 15:04:05"),
	}

	err = app.DBService.WriteEvent(event)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err.Error()))
	}

	return c.JSON(http.StatusOK, ReturnOk(event))
}

func (app *Application) GetAllEventsHandler(c echo.Context) error {
	events, err := app.DBService.QueryAllEvents()
	if err != nil {
		// Log the error and return an appropriate error response
		app.Logger.Error("Failed to query all events: ", err)
		return c.JSON(http.StatusInternalServerError, ReturnErr("Failed to fetch events"))
	}

	return c.JSON(http.StatusOK, ReturnOk(events))
}

func (app *Application) GetAllEventsBySlugHandler(c echo.Context) error {
	slug := c.Param("slug")
	from := c.QueryParam("from")
	to := c.QueryParam("to")
	n := c.QueryParam("n")
	sort := strings.ToLower(c.QueryParam("sort"))

	now := time.Now().In(app.Config.TimeLocation)
	var desc string

	if from == "" {
		from = now.AddDate(-1, 0, 0).Format("2006-01-02") // One year ago
	}
	if to == "" {
		to = now.Format("2006-01-02") // Today
	}
	if n == "" {
		n = "99999999"
	}
	if sort == "" || sort == "asc" {
		desc = "false"
	} else {
		desc = "true"
	}

	// Parse the dates from the query parameters
	fromTime, err := time.ParseInLocation("2006-01-02", from, app.Config.TimeLocation)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ReturnErr("Invalid 'from' date format"))
	}
	toTime, err := time.ParseInLocation("2006-01-02", to, app.Config.TimeLocation)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ReturnErr("Invalid 'to' date format"))
	}
	nNum, err := strconv.Atoi(n)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ReturnErr("'n' is not a number"))
	}

	// Adjust 'toTime' to the end of the day if you want the 'to' date to be inclusive
	toTime = toTime.Add(24 * time.Hour)

	if toTime.After(now) {
		toTime = now
	}

	if fromTime.After(toTime) {
		fromTime = now
	}

	events, err := app.DBService.QueryEventsBySlug(slug, fromTime, toTime, uint(nNum), desc)
	if err != nil {
		// Log the error and return an appropriate error response
		app.Logger.Error("Failed to query all events: ", err)
		return c.JSON(http.StatusInternalServerError, ReturnErr("Failed to fetch events"))
	}

	return c.JSON(http.StatusOK, ReturnOk(events))
}
