package middleware

import (
	"github.com/golang-jwt/jwt/v5"
)

type JWTCustomClaims struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	jwt.RegisteredClaims
}
