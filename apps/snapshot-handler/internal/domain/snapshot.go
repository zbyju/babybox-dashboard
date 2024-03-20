package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Snapshot struct {
	ID           primitive.ObjectID `json:"-" bson:"_id,omitempty"`
	Slug         string             `json:"slug" bson:"slug"`
	Temperatures Temperatures       `json:"temperatures" bson:"temperatures"`
	Voltages     Voltages           `json:"voltage" bson:"voltage"`
	Version      uint               `json:"version" bson:"version"`
	Timestamp    string             `json:"timestamp" bson:"timestamp"`
}

type Temperatures struct {
	Inside  float64 `json:"inside" bson:"inside"`
	Outside float64 `json:"outside" bson:"outside"`
	Casing  float64 `json:"casing" bson:"casing"`
	Top     float64 `json:"top" bson:"top"`
	Bottom  float64 `json:"bottom" bson:"bottom"`
}

type Voltages struct {
	In      float64 `json:"in" bson:"in"`
	Battery float64 `json:"battery" bson:"battery"`
}
