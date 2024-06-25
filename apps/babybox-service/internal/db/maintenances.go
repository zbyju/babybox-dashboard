package db

import (
	"context"

	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (db *DBService) InsertMaintenance(maintenance domain.BabyboxMaintenance) (*domain.BabyboxMaintenance, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")

	id := utils.GenerateMID(maintenance.Start)
	maintenance.ID = id

	_, err := collection.InsertOne(context.TODO(), maintenance)
	if err != nil {
		return nil, err
	}

	return &maintenance, nil
}

// UpdateMaintenance updates an existing BabyboxIssue
func (db *DBService) UpdateMaintenance(maintenance domain.BabyboxMaintenance) (*domain.BabyboxMaintenance, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")

	filter := bson.M{"_id": maintenance.ID}
	update := bson.M{"$set": maintenance}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

	var updatedMaintenance domain.BabyboxMaintenance
	err := collection.FindOneAndUpdate(context.TODO(), filter, update, opts).Decode(&updatedMaintenance)
	if err != nil {
		return nil, err
	}

	return &updatedMaintenance, nil
}

// DeleteMaintenance deletes a domain.BabyboxIssue by its ID
func (db *DBService) DeleteMaintenance(id string, deleteIssues bool) error {
	// First update or delete any related issues
	issues, err := db.FindIssuesByMaintenance(id)
	if err != nil {
		return err
	}
	issueCollection := db.Client.Database(db.DatabaseName).Collection("issues")
	if deleteIssues {
		for _, issue := range issues {
			filter := bson.M{"_id": issue.ID}
			_, err := issueCollection.DeleteOne(context.TODO(), filter)
			if err != nil {
				return err
			}
		}
	} else {
		for _, issue := range issues {
			filter := bson.M{"_id": issue.ID}
			update := bson.M{"$unset": "maintenance"}
			_, err := issueCollection.UpdateOne(context.TODO(), filter, update)
			if err != nil {
				return err
			}
		}
	}

	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")

	filter := bson.M{"_id": id}
	_, err = collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return err
	}

	return nil
}

// FindAllMaintenances gets all domain.BabyboxIssues
func (db *DBService) FindAllMaintenances() ([]domain.BabyboxMaintenance, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")

	cursor, err := collection.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxMaintenance
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

// FindMaintenancesBySlug finds all domain.BabyboxIssues with a specific slug
func (db *DBService) FindMaintenancesBySlug(slug string) ([]domain.BabyboxMaintenance, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")

	filter := bson.M{"slugs": slug}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxMaintenance
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}
