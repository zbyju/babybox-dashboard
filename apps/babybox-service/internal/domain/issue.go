package domain

import (
	"time"
)

type BabyboxIssueDescription struct {
	Type        string `json:"type" bson:"type"`
	Subtype     string `json:"subtype" bson:"subtype"`
	Description string `json:"description,omitempty" bson:"description,omitempty"` // Optional field
	Context     string `json:"context,omitempty" bson:"context,omitempty"`         // Optional field
}

type BabyboxIssue struct {
	ID          string                  `json:"id,omitempty" bson:"_id,omitempty"`                  // Optional field
	Maintenance string                  `json:"maintenance,omitempty" bson:"maintenance,omitempty"` // Optional field
	Timestamp   time.Time               `json:"timestamp" bson:"timestamp"`
	Slug        string                  `json:"slug" bson:"slug"`
	Priority    string                  `json:"priority" bson:"priority"`
	Severity    string                  `json:"severity" bson:"severity"`
	Assignee    string                  `json:"assignee,omitempty" bson:"assignee,omitempty"` // Optional field
	Issue       BabyboxIssueDescription `json:"issue" bson:"issue"`
	CreatedAt   *time.Time              `json:"created_at,omitempty" bson:"created_at,omitempty"` // Optional field
	IsSolved    bool                    `json:"isSolved" bson:"is_solved"`
	SolvedAt    *time.Time              `json:"solvedAt,omitempty" bson:"solved_at,omitempty"` // Optional field
}
