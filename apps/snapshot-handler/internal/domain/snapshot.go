package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Snapshot struct {
	ID           primitive.ObjectID `json:"-"`
	Slug         string             `json:"slug"`
	Temperatures Temperatures       `json:"temperatures"`
	Voltages     Voltages           `json:"voltage"`
	Version      uint               `json:"version"`
	Timestamp    string             `json:"timestamp"`
}

type Temperatures struct {
	Inside  float64 `json:"inside"`
	Outside float64 `json:"outside"`
	Casing  float64 `json:"casing"`
	Top     float64 `json:"top"`
	Bottom  float64 `json:"bottom"`
}

type Voltages struct {
	In      float64 `json:"in"`
	Battery float64 `json:"battery"`
}
