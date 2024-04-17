package v1

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
	"go.mongodb.org/mongo-driver/mongo"
)

func (app *Application) CreateBabybox(c echo.Context) error {
	babybox := new(domain.Babybox)
	if err := c.Bind(babybox); err != nil {
		return err
	}

	result, err := app.DBService.InsertBabybox(babybox.Slug, babybox.Name)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return c.JSON(http.StatusBadRequest, ReturnErr(err.Error()))
		}
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusCreated, ReturnOk(result))
}

func (app *Application) GetBabyboxBySlug(c echo.Context) error {
	slug := c.Param("slug")

	babybox, err := app.DBService.FindBabyboxBySlug(slug)

	if err == mongo.ErrNoDocuments {
		return c.JSON(http.StatusNotFound, ReturnErr(fmt.Sprintf("Babybox with slug: '%s' was not found.", slug)))
	} else if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	} else if babybox == nil {
    return c.JSON(http.StatusNotFound, ReturnErr(fmt.Sprintf("Babybox with slug: '%s' was not found.", slug)))
  }

	return c.JSON(http.StatusOK, ReturnOk(babybox))
}

func (app *Application) UpdateBabybox(c echo.Context) error {
	slug := c.Param("slug")
	babybox := new(domain.Babybox)
	if err := c.Bind(babybox); err != nil {
		return err
	}

	if babybox.Slug != slug {
		return c.JSON(http.StatusBadRequest, ReturnErr(fmt.Sprintf("Slug in URL ('%s') does not match slug used in request body ('%s').", slug, babybox.Slug)))
	}

	existingBabybox, err := app.DBService.FindBabyboxBySlug(slug)
	if err != nil {
		return c.JSON(http.StatusNotFound, ReturnErr(fmt.Sprintf("No babybox found based on slug: '%s'", babybox.Slug)))
	}

	babybox.ID = existingBabybox.ID
	babybox.CreatedAt = existingBabybox.CreatedAt

	updatedBabybox, err := app.DBService.UpdateBabybox(*babybox)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(updatedBabybox))
}

func (app *Application) GetAllBabyboxesNames(c echo.Context) error {
	babyboxes, err := app.DBService.FindBabyboxesNames()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ReturnErr(err))
	}

	return c.JSON(http.StatusOK, ReturnOk(babyboxes))
}
