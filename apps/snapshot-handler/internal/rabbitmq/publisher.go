package rabbitmq

import (
	"encoding/json"

	"github.com/streadway/amqp"
	"github.com/zbyju/babybox-dashboard/apps/snapshot-handler/internal/domain"
)

// How long the messages stay in queue
const ttl int32 = 1000 * 60 * 10

func (p *Client) PublishSnapshot(snapshot domain.Snapshot) error {
	ch, err := p.conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"newSnapshotsQueue",          // Queue name
		false,                        // Durable
		false,                        // Delete when unused
		false,                        // Exclusive
		false,                        // No-wait
		amqp.Table{"x-expires": ttl}, // Arguments
	)
	if err != nil {
		return err
	}

	// Serialize the Snapshot to JSON
	body, err := json.Marshal(snapshot)
	if err != nil {
		return err
	}

	// Publish the serialized Snapshot to the declared queue
	err = ch.Publish(
		"",     // Exchange
		q.Name, // Routing key (queue name)
		false,  // Mandatory
		false,  // Immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})

	if err != nil {
		return err
	}
	return nil
}
