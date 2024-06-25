package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Snapshot struct {
	ID          primitive.ObjectID `json:"-"`
	Slug        string             `json:"slug"`
	Temperature Temperature        `json:"temperature"`
	Voltage     Voltage            `json:"voltage"`
	Version     uint               `json:"version"`
	Timestamp   time.Time          `json:"timestamp"`
	Status      uint32             `json:"status"`
}

type Temperature struct {
	Inside  *float64 `json:"inside"`
	Outside *float64 `json:"outside"`
	Casing  *float64 `json:"casing"`
	Top     *float64 `json:"top"`
	Bottom  *float64 `json:"bottom"`
}

type Voltage struct {
	In      *float64 `json:"in"`
	Battery *float64 `json:"battery"`
}

// Agregate types

type WeekdayTemperature struct {
	Weekday         int
	MeanTemperature float64
}
