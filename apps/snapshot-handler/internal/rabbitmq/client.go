package rabbitmq

import (
	"fmt"
	"log"
	"os"

	"github.com/streadway/amqp"
)

type Client struct {
	conn                *amqp.Connection
	newSnapshotsChannel *amqp.Channel
	newSnapshotsQueue   *amqp.Queue
}

// How long the messages stay in queue
const ttl int32 = 1000 * 60 * 10

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

	// Queue Declaration
	err = ch.ExchangeDeclare(
		"snapshot.received",              // Queue exchange
		"fanout",                     // Type of exchange
		true,                         // Durable
		false,                        // Delete when unused
		false,                        // Exclusive
		false,                        // No-wait
		amqp.Table{"x-expires": ttl}, // Arguments
	)
	if err != nil {
		return nil, err
	}

	fmt.Println("Created the exchange snapshot.received")

	return &Client{conn: conn, newSnapshotsChannel: ch}, nil
}

func (c *Client) Close() {
	c.newSnapshotsChannel.Close()
	c.conn.Close()
}
