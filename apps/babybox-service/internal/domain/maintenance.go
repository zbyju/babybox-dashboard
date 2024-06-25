package domain

import (
	"time"
)

type BabyboxMaintenance struct {
	ID       string     `bson:"_id,omitempty" json:"id,omitempty"`
	State    string     `bson:"state" json:"state"`
	Start    time.Time  `bson:"start" json:"start"`
	End      *time.Time `bson:"end,omitempty" json:"end,omitempty"`
	Assignee string     `bson:"assignee,omitempty" json:"assignee,omitempty"`
	Slugs    *[]string  `bson:"slugsomitempty" json:"slugs,omitempty"`
	Note     string     `bson:"note,omitempty" json:"note,omitempty"`
	Distance float64    `bson:"distance,omitempty" json:"distance,omitempty"`
}
