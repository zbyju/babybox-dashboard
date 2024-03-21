package main

import (
	"fmt"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/api"
	v1 "github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/api/v1"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/db"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/rabbitmq"
)

func main() {
	location, err := time.LoadLocation("Europe/Prague")
	if err != nil {
		fmt.Println("Error loading location:", err)
		return
	}

	e := echo.New()

	dbService, err := db.InitConnection(&e.Logger, location)
	if err != nil {
		e.Logger.Errorf(err.Error())
		return
	}

	mqService, err := rabbitmq.NewClient()
	if err != nil {
		e.Logger.Errorf(err.Error())
		return
	}

	app := &v1.Application{
		Logger: e.Logger,
		Config: &v1.Config{
			Version:      "0.0.1",
			Port:         8080,
			TimeLocation: location,
		},
		DBService: dbService,
		MQService: mqService,
	}

	// Register versioned API routes
	api.RegisterRoutes(e, app)

	// Start the server
	e.Logger.Fatal(e.Start(":" + fmt.Sprint(app.Config.Port)))
}
