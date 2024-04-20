package rabbitmq

import (
	"fmt"
	"log"
	"os"

	"github.com/streadway/amqp"
)

type Client struct {
	conn                 *amqp.Connection
	newSnapshotsChannel  *amqp.Channel
	newSnapshotsDelivery <-chan amqp.Delivery
}

func NewClient() (*Client, error) {
	rabbitmqUsername := os.Getenv("RABBITMQ_USERNAME")
	rabbitmqPassword := os.Getenv("RABBITMQ_PASSWORD")

	if rabbitmqUsername == "" || rabbitmqPassword == "" {
		log.Printf("One or more required environment variables are missing (username='%s' | password='%s')\n", rabbitmqUsername, rabbitmqPassword)
		return nil, fmt.Errorf("missing environment variables for InfluxDB connection")
	}

	url := fmt.Sprintf("amqp://%s:%s@rabbitmq:5672/", rabbitmqUsername, rabbitmqPassword)

	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	err = ch.ExchangeDeclare(
		"snapshot.received",   // name
		"fanout", // type
		true,     // durable
		false,    // auto-deleted
		false,    // internal
		false,    // no-wait
		nil,      // arguments
	)

	if err != nil {
		log.Println("Error when declaring exchange ", err)
	}

	q, err := ch.QueueDeclare(
		"babybox-service.snapshot.processor", // name
		false,                 // durable
		false,                 // delete when unused
		false,                  // exclusive
		false,                 // no-wait
		nil,                   // arguments
	)
	if err != nil {
		log.Println("Error when declaring queue: ", err)
	}

	err = ch.QueueBind(
		q.Name,          // queue name
		"",              // routing key
		"snapshot.received", // exchange
		false,
		nil,
	)
	if err != nil {
		log.Println("Error when queue binding: ", err)
	}

	// Set up a consumer
	delivery, err := ch.Consume(
		q.Name, // Queue name
		"babybox-service",     // Consumer name
		true,                  // Auto-ack
		false,                 // Exclusive
		false,                 // No-local
		false,                 // No-wait
		nil,                   // Args
	)
	if err != nil {
		return nil, err
	}

	return &Client{conn: conn, newSnapshotsChannel: ch, newSnapshotsDelivery: delivery}, nil
}

func (c *Client) Close() {
	c.newSnapshotsChannel.Close()
	c.conn.Close()
}
