package rabbitmq

import (
	"encoding/json"
	"fmt"

	"github.com/streadway/amqp"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
)

func (c *Client) PublishMaintenanceCreated(maintenance domain.BabyboxMaintenance) error {
	return c.publishMessage("maintenance.created", maintenance)
}

func (c *Client) PublishMaintenanceUpdated(maintenance domain.BabyboxMaintenance) error {
	return c.publishMessage("maintenance.updated", maintenance)
}

func (c *Client) PublishMaintenanceDeleted(maintenance domain.BabyboxMaintenance) error {
	return c.publishMessage("maintenance.deleted", maintenance)
}

func (c *Client) PublishIssueCreated(issue domain.BabyboxIssue) error {
	return c.publishMessage("issue.created", issue)
}

func (c *Client) PublishIssueUpdated(issue domain.BabyboxIssue) error {
	return c.publishMessage("issue.updated", issue)
}

func (c *Client) PublishIssueDeleted(issue domain.BabyboxIssue) error {
	return c.publishMessage("issue.deleted", issue)
}

var _ domain.MessagePublisher = (*Client)(nil)

func (c *Client) publishMessage(exchangeName string, payload interface{}) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("error marshaling payload: %v", err)
	}

	err = c.Channel.Publish(
		exchangeName, // exchange
		"",           // routing key
		false,        // mandatory
		false,        // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})

	if err != nil {
		return fmt.Errorf("error publishing message to exchange %s: %v", exchangeName, err)
	}

	return nil
}
