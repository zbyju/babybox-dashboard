package db

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DBService represents a database service
type DBService struct {
	Client       *mongo.Client
	DatabaseName string

	Logger       echo.Logger
	TimeLocation *time.Location
}

// InitDBService initializes a MongoDB connection and returns a DBService instance
func InitConnection(logger *echo.Logger, location *time.Location) (*DBService, error) {
	mongoDBDatabase := os.Getenv("MONGODB_DATABASE")

	uri := fmt.Sprintf("mongodb://mongodb:27017/%s", mongoDBDatabase)

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return nil, err
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		return nil, err
	}

	return &DBService{Client: client, DatabaseName: mongoDBDatabase, Logger: *logger, TimeLocation: location}, nil
}
