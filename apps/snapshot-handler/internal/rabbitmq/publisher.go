package rabbitmq

import (
	"encoding/json"

	"github.com/streadway/amqp"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
)

func (p *Client) PublishSnapshot(snapshot domain.Snapshot) error {
	// Serialize the Snapshot to JSON
	body, err := json.Marshal(snapshot)
	if err != nil {
		return err
	}

	// Publish the serialized Snapshot to the declared queue
	err = p.newSnapshotsChannel.Publish(
		"",                       // Exchange
		p.newSnapshotsQueue.Name, // Routing key (queue name)
		false,                    // Mandatory
		false,                    // Immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})

	if err != nil {
		return err
	}
	return nil
}
