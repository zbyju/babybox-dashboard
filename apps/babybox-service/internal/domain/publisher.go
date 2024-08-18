package domain

type MessagePublisher interface {
	PublishMaintenanceCreated(maintenance BabyboxMaintenance) error
	PublishMaintenanceUpdated(maintenance BabyboxMaintenance) error
	PublishMaintenanceDeleted(maintenance BabyboxMaintenance) error
	PublishIssueCreated(issue BabyboxIssue) error
	PublishIssueUpdated(issue BabyboxIssue) error
	PublishIssueDeleted(issue BabyboxIssue) error
}
