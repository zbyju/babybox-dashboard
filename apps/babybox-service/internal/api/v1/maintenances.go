package v1

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
	"go.mongodb.org/mongo-driver/mongo"
)

type MaintenanceRequest struct {
	Maintenance domain.BabyboxMaintenance `json:"maintenance"`
	Issues      []string                  `json:"issues"`
}

// CreateMaintenance inserts a new BabyboxMaintenance
func (app *Application) CreateMaintenance(c echo.Context) error {
	data := new(MaintenanceRequest)
	if err := c.Bind(data); err != nil {
		fmt.Printf("Error when converting to BabyboxMaintenance type from client: %v", err)
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	result, err := app.DBService.InsertMaintenance(data.Maintenance, data.Issues)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusCreated, ReturnOk(result))
}

// UpdateMaintenance updates an existing BabyboxMaintenance
func (app *Application) UpdateMaintenance(c echo.Context) error {
	idStr := c.Param("id")

	maintenance := new(domain.BabyboxMaintenance)
	if err := c.Bind(maintenance); err != nil {
		return err
	}

	updatedMaintenance, err := app.DBService.UpdateMaintenance(*maintenance)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.JSON(http.StatusNotFound, ReturnErr(fmt.Sprintf("Maintenance with ID: '%s' was not found.", idStr)))
		}
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(updatedMaintenance))
}

// DeleteMaintenance deletes a BabyboxMaintenance by its ID
func (app *Application) DeleteMaintenance(c echo.Context) error {
	id := c.Param("id")

	err := app.DBService.DeleteMaintenance(id, false)
	if err != nil {
		fmt.Println(err)
		if err == mongo.ErrNoDocuments {
			return c.JSON(http.StatusNotFound, ReturnErr(fmt.Sprintf("Maintenance with ID: '%s' was not found.", id)))
		}
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.NoContent(http.StatusNoContent)
}

// GetAllMaintenances gets all BabyboxMaintenances
func (app *Application) GetAllMaintenances(c echo.Context) error {
	maintenances, err := app.DBService.FindAllMaintenances()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(maintenances))
}

// GetMaintenancesBySlug finds all BabyboxMaintenances with a specific slug
func (app *Application) GetMaintenancesBySlug(c echo.Context) error {
	slug := c.Param("slug")

	maintenances, err := app.DBService.FindMaintenancesBySlug(slug)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(maintenances))
}

func (app *Application) GetMaintenancesByUsername(c echo.Context) error {
	username := c.Param("username")

	maintenances, err := app.DBService.FindMaintenancesByUsername(username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(maintenances))
}

func (app *Application) GetMaintenanceByID(c echo.Context) error {
	id := c.Param("id")

	maintenance, err := app.DBService.FindMaintenanceByID(id)
	fmt.Println(err)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(maintenance))
}
