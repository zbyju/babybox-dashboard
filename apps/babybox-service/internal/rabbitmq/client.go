package rabbitmq

import (
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/streadway/amqp"
)

type Exchange struct {
	Name       string
	Type       string
	Durable    bool
	AutoDelete bool
	Internal   bool
	NoWait     bool
	Arguments  amqp.Table
}

type Client struct {
	Conn                 *amqp.Connection
	Channel              *amqp.Channel
	Exchanges            map[string]*Exchange
	newSnapshotsDelivery <-chan amqp.Delivery
	mu                   sync.RWMutex
}

func NewClient() (*Client, error) {
	rabbitmqUsername := os.Getenv("RABBITMQ_USERNAME")
	rabbitmqPassword := os.Getenv("RABBITMQ_PASSWORD")
	if rabbitmqUsername == "" || rabbitmqPassword == "" {
		log.Printf("One or more required environment variables are missing (username='%s' | password='%s')\n", rabbitmqUsername, rabbitmqPassword)
		return nil, fmt.Errorf("missing environment variables for RabbitMQ connection")
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

	client := &Client{
		Conn:      conn,
		Channel:   ch,
		Exchanges: make(map[string]*Exchange),
	}

	// Declare queue and bind to "snapshot.received" exchange
	err = client.setupSnapshotQueue()
	if err != nil {
		client.Close()
		return nil, err
	}

	// Define and create other required exchanges
	requiredExchanges := []Exchange{
		{"issue.created", "fanout", true, false, false, false, nil},
		{"issue.updated", "fanout", true, false, false, false, nil},
		{"issue.deleted", "fanout", true, false, false, false, nil},
		{"maintenance.created", "fanout", true, false, false, false, nil},
		{"maintenance.updated", "fanout", true, false, false, false, nil},
		{"maintenance.deleted", "fanout", true, false, false, false, nil},
	}

	for _, exchange := range requiredExchanges {
		err := client.AddExchange(exchange.Name, exchange.Type, exchange.Durable, exchange.AutoDelete, exchange.Internal, exchange.NoWait, exchange.Arguments)
		if err != nil {
			client.Close()
			return nil, fmt.Errorf("failed to create exchange %s: %v", exchange.Name, err)
		}
	}

	return client, nil
}

func (c *Client) setupSnapshotQueue() error {
	// Declare the queue
	q, err := c.Channel.QueueDeclare(
		"babybox-service.snapshot.processor", // name
		false,                                // durable
		false,                                // delete when unused
		false,                                // exclusive
		false,                                // no-wait
		nil,                                  // arguments
	)
	if err != nil {
		return fmt.Errorf("error declaring queue: %v", err)
	}

	// Bind the queue to the "snapshot.received" exchange
	err = c.Channel.QueueBind(
		q.Name,              // queue name
		"",                  // routing key
		"snapshot.received", // exchange
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("error binding queue: %v", err)
	}

	// Set up a consumer
	delivery, err := c.Channel.Consume(
		q.Name,            // Queue name
		"babybox-service", // Consumer name
		true,              // Auto-ack
		false,             // Exclusive
		false,             // No-local
		false,             // No-wait
		nil,               // Args
	)
	if err != nil {
		return fmt.Errorf("error setting up consumer: %v", err)
	}

	c.newSnapshotsDelivery = delivery
	return nil
}

func (c *Client) AddExchange(name, exchangeType string, durable, autoDelete, internal, noWait bool, arguments amqp.Table) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if _, exists := c.Exchanges[name]; exists {
		return fmt.Errorf("exchange %s already exists", name)
	}

	err := c.Channel.ExchangeDeclare(
		name,
		exchangeType,
		durable,
		autoDelete,
		internal,
		noWait,
		arguments,
	)
	if err != nil {
		return err
	}

	c.Exchanges[name] = &Exchange{
		Name:       name,
		Type:       exchangeType,
		Durable:    durable,
		AutoDelete: autoDelete,
		Internal:   internal,
		NoWait:     noWait,
		Arguments:  arguments,
	}

	fmt.Printf("Created the exchange: %s\n", name)
	return nil
}

func (c *Client) Close() {
	c.Channel.Close()
	c.Conn.Close()
}
