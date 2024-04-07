package domain

type Event struct {
	Slug      string `json:"slug"`
	Unit      string `json:"unit"`
	EventCode string `json:"event_code"`
	Timestamp string `json:"timestamp"`
}
