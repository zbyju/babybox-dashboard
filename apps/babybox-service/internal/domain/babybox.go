package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Babybox struct {
	ID            primitive.ObjectID    `json:"-" bson:"_id"`
	Slug          string                `json:"slug" bson:"slug"`
	Name          string                `json:"name" bson:"name"`
	CreatedAt     time.Time             `json:"created_at" bson:"created_at"`
	Location      *Location             `json:"location,omitempty" bson:"location,omitempty"`
	NetworkConfig *NetworkConfiguration `json:"network_configuration,omitempty" bson:"network_configuration,omitempty"`
}

// Location struct with optional Coordinates
type Location struct {
	Hospital    string       `json:"hospital" bson:"hospital"`
	City        string       `json:"city" bson:"city"`
	Street      string       `json:"street" bson:"street"`
	Postcode    string       `json:"postcode" bson:"postcode"`
	Coordinates *Coordinates `json:"coordinates,omitempty" bson:"coordinates,omitempty"`
}

type Coordinates struct {
	Latitude  float64 `json:"latitude" bson:"latitude"`
	Longitude float64 `json:"longitude" bson:"longitude"`
}

// NetworkConfiguration struct
type NetworkConfiguration struct {
	Type        string   `json:"type" bson:"type"`
	IPAddresses IPConfig `json:"ip_addresses" bson:"ip_addresses"`
}

// IPConfig struct to neatly hold network IPs
type IPConfig struct {
	Router      string `json:"router" bson:"router"`
	EngineUnit  string `json:"engine_unit" bson:"engine_unit"`
	ThermalUnit string `json:"thermal_unit" bson:"thermal_unit"`
	Camera      string `json:"camera" bson:"camera"`
	PC          string `json:"pc" bson:"pc"`
	Gateway     string `json:"gateway" bson:"gateway"`
}
