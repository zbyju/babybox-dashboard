package domain

import (
	"time"
)

type IssueComment struct {
	Text      string    `json:"text" bson:"text"`
	Timestamp time.Time `json:"timestamp" bson:"timestamp"`
	Username  string    `bson:"username" json:"username"`
}

type IssueStateUpdate struct {
	State     string    `bson:"state" json:"state"` // Possible states: Created, Open, Denied, Solved
	Timestamp time.Time `bson:"timestamp" json:"timestamp"`
	Username  string    `bson:"username" json:"username"`
}

type BabyboxIssueDescription struct {
	Type        string `json:"type" bson:"type"`
	Subtype     string `json:"subtype" bson:"subtype"`
	Description string `json:"description,omitempty" bson:"description,omitempty"` // Optional field
	Context     string `json:"context,omitempty" bson:"context,omitempty"`         // Optional field
}

type BabyboxIssue struct {
	ID            string                  `json:"id,omitempty" bson:"_id,omitempty"`                        // Optional field
	MaintenanceID string                  `json:"maintenance_id,omitempty" bson:"maintenance_id,omitempty"` // Optional field
	Slug          string                  `json:"slug" bson:"slug"`
	Title         string                  `json:"title" bson:"title"`
	Priority      string                  `json:"priority" bson:"priority"`
	Severity      string                  `json:"severity" bson:"severity"`
	Assignee      string                  `json:"assignee,omitempty" bson:"assignee,omitempty"` // Optional field
	Issue         BabyboxIssueDescription `json:"issue" bson:"issue"`

	// Histories: first element = latest = newest; last element = earliest = oldest
	StateHistory []IssueStateUpdate `json:"state_history" bson:"state_history"`
	Comments     []IssueComment     `json:"comments,omitempty" bson:"comments,omitempty"`
}
