package v1

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
	"go.mongodb.org/mongo-driver/mongo"
)

// CreateIssue inserts a new BabyboxIssue
func (app *Application) CreateIssue(c echo.Context) error {
	issue := new(domain.BabyboxIssue)
	if err := c.Bind(issue); err != nil {
		return err
	}

	result, err := app.DBService.InsertIssue(*issue)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusCreated, ReturnOk(result))
}

// UpdateIssue updates an existing BabyboxIssue
func (app *Application) UpdateIssue(c echo.Context) error {
	idStr := c.Param("id")

	issue := new(domain.BabyboxIssue)
	if err := c.Bind(issue); err != nil {
		return err
	}

	updatedIssue, err := app.DBService.UpdateIssue(*issue)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.JSON(http.StatusNotFound, ReturnErr(fmt.Sprintf("Issue with ID: '%s' was not found.", idStr)))
		}
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(updatedIssue))
}

// DeleteIssue deletes a BabyboxIssue by its ID
func (app *Application) DeleteIssue(c echo.Context) error {
	id := c.Param("id")

	err := app.DBService.DeleteIssue(id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.JSON(http.StatusNotFound, ReturnErr(fmt.Sprintf("Issue with ID: '%s' was not found.", id)))
		}
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.NoContent(http.StatusOK)
}

// GetAllIssues gets all BabyboxIssues
func (app *Application) GetAllIssues(c echo.Context) error {
	issues, err := app.DBService.FindAllIssues()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(issues))
}

// GetIssuesBySlug finds all BabyboxIssues with a specific slug
func (app *Application) GetIssueByID(c echo.Context) error {
	id := c.Param("id")

	issues, err := app.DBService.FindIssueByID(id)
	fmt.Println(err)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(issues))
}

// GetIssuesBySlug finds all BabyboxIssues with a specific slug
func (app *Application) GetIssuesBySlug(c echo.Context) error {
	slug := c.Param("slug")

	issues, err := app.DBService.FindIssuesBySlug(slug)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(issues))
}

func (app *Application) GetIssuesByMaintenance(c echo.Context) error {
	id := c.Param("id")

	issues, err := app.DBService.FindIssuesByMaintenance(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(issues))
}

// GetIssuesByUsername finds all BabyboxIssues assigned to a specific user
func (app *Application) GetIssuesByUsername(c echo.Context) error {
	username := c.Param("username")

	issues, err := app.DBService.FindIssuesByUsername(username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(issues))
}

func (app *Application) GetIssuesUnsolved(c echo.Context) error {
	issues, err := app.DBService.FindMaintenancesUnsolvedOptionallyBySlug("")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(issues))
}

func (app *Application) GetIssuesUnsolvedBySlug(c echo.Context) error {
	slug := c.Param("slug")

	issues, err := app.DBService.FindMaintenancesUnsolvedOptionallyBySlug(slug)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(issues))
}
