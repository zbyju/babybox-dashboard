package main

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/api"
	v1 "github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/api/v1"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/db"
)

func main() {
	e := echo.New()

	dbService, err := db.InitConnection()

	if err != nil {
		e.Logger.Errorf(err.Error())
		return
	}

	app := &v1.Application{
		Logger: e.Logger,
		Config: &v1.Config{
			Version: "0.0.1",
			Port:    8080,
		},
		DBService: dbService,
	}

	// Register versioned API routes
	api.RegisterRoutes(e, app)

	// Start the server
	e.Logger.Fatal(e.Start(":" + fmt.Sprint(app.Config.Port)))
}
