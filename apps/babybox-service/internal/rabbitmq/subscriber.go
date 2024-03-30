package rabbitmq

import (
	"encoding/json"
	"log"

	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/db"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
	"go.mongodb.org/mongo-driver/mongo"
)

func (c *Client) HandleNewSnapshots(dbService *db.DBService) {
	forever := make(chan bool)

	go func() {
		for msg := range c.newSnapshotsDelivery {
			var snapshot domain.Snapshot
			if err := json.Unmarshal(msg.Body, &snapshot); err != nil {
				log.Printf("Error unmarshalling snapshot: %v\n", err)
				continue // Skip malformed messages
			}

			// Check if Babybox exists (with error handling)
			_, err := dbService.FindBabyboxBySlug(snapshot.Slug)
			if err != nil {
				if err == mongo.ErrNoDocuments {
					// Create Babybox
					_, err := dbService.InsertBabybox(snapshot.Slug, snapshot.Slug)
					if err != nil {
						log.Printf("Error creating Babybox: %v\n", err)
					}
				} else {
					// Handle unexpected database error
					log.Printf("Error checking Babybox existence: %v\n", err)
				}
			}
		}
	}()

	log.Printf(" [*] Waiting for messages in newSnapshotsQueue.")
	<-forever
}
