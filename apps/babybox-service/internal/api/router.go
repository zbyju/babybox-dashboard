package api

import (
	"os"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	v1 "github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/api/v1"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/middleware"
)

// RegisterRoutes registers versioned API routes
func RegisterRoutes(e *echo.Echo, app *v1.Application) {
	v1Group := e.Group("/v1")

	jwt_secret := os.Getenv("JWT_SECRET")

	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(middleware.JWTCustomClaims)
		},
		SigningKey: []byte(jwt_secret),
	}
	v1Group.Use(echojwt.WithConfig(config))

	v1.RegisterRoutes(v1Group, app)
}
