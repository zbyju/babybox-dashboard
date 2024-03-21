package rabbitmq

import (
	"fmt"
	"log"
	"os"

	"github.com/streadway/amqp"
)

type Client struct {
	conn *amqp.Connection
}

func NewClient() (*Client, error) {
	rabbitmqUsername := os.Getenv("RABBITMQ_USERNAME")
	rabbitmqPassword := os.Getenv("RABBITMQ_PASSWORD")

	if rabbitmqUsername == "" || rabbitmqPassword == "" {
		log.Printf("One or more required environment variables are missing (username='%s' | password='%s')\n", rabbitmqUsername, rabbitmqPassword)
		return nil, fmt.Errorf("missing environment variables for InfluxDB connection")
	}

	url := fmt.Sprintf("amqp://%s:%s@rabbitmq:5672/", rabbitmqUsername, rabbitmqPassword)
	fmt.Println(url)

	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, err
	}
	return &Client{conn: conn}, nil
}

func (c *Client) Close() {
	c.conn.Close()
}
