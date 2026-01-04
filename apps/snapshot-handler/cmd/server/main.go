package main

import (
	"fmt"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/api"
	v1 "github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/api/v1"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/db"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/rabbitmq"
)

const maxRetries = 15
const retryDelay = 5 * time.Second

func main() {
	location, err := time.LoadLocation("Europe/Prague")
	if err != nil {
		fmt.Println("Error loading location:", err)
		return
	}

	e := echo.New()
	e.Use(middleware.CORS())
	e.Logger.SetLevel(0)
	e.Use(middleware.Logger())

	var dbService *db.DBService
	var mqService *rabbitmq.Client

	for i := range maxRetries {
		dbService, err = db.InitConnection(&e.Logger, location)
		if err != nil {
			e.Logger.Errorf("Failed to initialize DB service: %s", err)
			if i < maxRetries-1 {
				e.Logger.Infof("Retrying in %v...", retryDelay)
				time.Sleep(retryDelay)
				continue
			} else {
				return
			}
		}

		mqService, err = rabbitmq.NewClient()
		if err != nil {
			e.Logger.Errorf("Failed to initialize MQ service: %s", err)
			if i < maxRetries-1 {
				e.Logger.Infof("Retrying in %v...", retryDelay)
				time.Sleep(retryDelay)
				continue
			} else {
				return
			}
		}

		// If both services initialized successfully, break out of the loop
		break
	}
	defer mqService.Close()

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
