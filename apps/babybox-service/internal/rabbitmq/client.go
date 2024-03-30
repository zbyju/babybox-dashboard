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

	channel, err := conn.Channel()
	if err != nil {
		return nil, err
	}
	defer channel.Close()

	// Set up a consumer
	delivery, err := channel.Consume(
		"newSnapshotsQueue", // Queue name
		"babybox-service",   // Consumer name
		true,                // Auto-ack
		false,               // Exclusive
		false,               // No-local
		false,               // No-wait
		nil,                 // Args
	)
	if err != nil {
		return nil, err
	}

	return &Client{conn: conn, newSnapshotsChannel: channel, newSnapshotsDelivery: delivery}, nil
}

func (c *Client) Close() {
	c.conn.Close()
}
