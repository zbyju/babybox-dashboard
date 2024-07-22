package domain

import "time"

type BabyboxMaintenance struct {
	ID       string     `json:"id" bson:"_id"`
	Title    string     `bson:"title" json:"title"`
	Assignee string     `bson:"assignee,omitempty" json:"assignee,omitempty"`
	Slug     string     `bson:"slug,omitempty" json:"slug,omitempty"`
	Note     string     `bson:"note,omitempty" json:"note,omitempty"`
	Distance float64    `bson:"distance,omitempty" json:"distance,omitempty"`
	Start    time.Time  `json:"start" bson:"start"`
	End      *time.Time `json:"end,omitempty" bson:"end,omitempty"`
	State    string     `json:"state" bson:"state"`
}
