package db

import (
	"context"
	"fmt"
	"time"

	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (db *DBService) UpdateIssuesForMaintenance(maintenanceID string, issueIDs []string) error {
	issuesCollection := db.Client.Database(db.DatabaseName).Collection("issues")
	ctx := context.Background()

	// Step 1: Change the state to "planned" if the issue was "open" and was linked to a maintenance
	stateUpdateFilter := bson.M{
		"_id":                   bson.M{"$in": issueIDs},
		"state_history.0.state": "open",
	}
	stateUpdateDoc := bson.M{
		"$push": bson.M{
			"state_history": bson.M{
				"$each":     []bson.M{{"state": "planned", "timestamp": time.Now(), "username": "SYSTEM"}},
				"$position": 0,
			},
		},
	}
	_, err := issuesCollection.UpdateMany(ctx, stateUpdateFilter, stateUpdateDoc)
	if err != nil {
		return fmt.Errorf("failed to update state property in state_history: %w", err)
	}

	// Step 2: Change the state to "open" if the maintenance was removed and the issue was planned
	stateUpdateFilter = bson.M{
		"maintenance_id":        maintenanceID,
		"_id":                   bson.M{"$nin": issueIDs},
		"state_history.0.state": "planned",
	}
	stateUpdateDoc = bson.M{
		"$push": bson.M{
			"state_history": bson.M{
				"$each":     []bson.M{{"state": "open", "timestamp": time.Now(), "username": "SYSTEM"}},
				"$position": 0,
			},
		},
	}
	_, err = issuesCollection.UpdateMany(ctx, stateUpdateFilter, stateUpdateDoc)
	if err != nil {
		return fmt.Errorf("failed to update state property in state_history: %w", err)
	}

	// Step 1: Update issues that should have this maintenance ID
	updateFilter := bson.M{
		"_id": bson.M{"$in": issueIDs},
	}
	updateDoc := bson.M{
		"$set": bson.M{
			"maintenance_id": maintenanceID,
		},
	}
	_, err = issuesCollection.UpdateMany(ctx, updateFilter, updateDoc)
	if err != nil {
		return fmt.Errorf("failed to update issues with maintenance ID: %w", err)
	}

	// Step 2: Remove maintenance ID from issues that should no longer have it
	removeFilter := bson.M{
		"maintenance_id": maintenanceID,
		"_id":            bson.M{"$nin": issueIDs},
	}
	removeDoc := bson.M{
		"$unset": bson.M{"maintenance_id": ""},
	}
	_, err = issuesCollection.UpdateMany(ctx, removeFilter, removeDoc)
	if err != nil {
		return fmt.Errorf("failed to remove maintenance ID from unrelated issues: %w", err)
	}

	return nil
}

func (db *DBService) InsertMaintenance(maintenance domain.BabyboxMaintenance, issueIDs []string) (*domain.BabyboxMaintenance, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")

	id := utils.GenerateMID(time.Now().In(db.TimeLocation))
	maintenance.ID = id

	_, err := collection.InsertOne(context.TODO(), maintenance)
	if err != nil {
		return nil, err
	}

	err = db.UpdateIssuesForMaintenance(id, issueIDs)
	if err != nil {
		return nil, err
	}

	db.MQPublisher.PublishMaintenanceCreated(maintenance)

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

	db.MQPublisher.PublishMaintenanceUpdated(updatedMaintenance)

	return &updatedMaintenance, nil
}

// DeleteMaintenance deletes a domain.BabyboxIssue by its ID
func (db *DBService) DeleteMaintenance(id string, deleteIssues bool) error {
	// First update any related issues
	err := db.UpdateIssuesForMaintenance(id, []string{})
	if err != nil {
		return err
	}

	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")

	filter := bson.M{"_id": id}
	var deletedMaintenance domain.BabyboxMaintenance
	err = collection.FindOneAndDelete(context.TODO(), filter).Decode(&deletedMaintenance)
	if err != nil {
		return err
	}

	db.MQPublisher.PublishMaintenanceUpdated(deletedMaintenance)

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

	if results == nil {
		return []domain.BabyboxMaintenance{}, nil
	}
	return results, nil
}

// FindMaintenancesBySlug finds all domain.BabyboxIssues with a specific slug
func (db *DBService) FindMaintenancesBySlug(slug string) ([]domain.BabyboxMaintenance, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")

	filter := bson.M{"slug": slug}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxMaintenance
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	if results == nil {
		return []domain.BabyboxMaintenance{}, nil
	}
	return results, nil
}

func (db *DBService) FindMaintenancesByUsername(user string) ([]domain.BabyboxMaintenance, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")
	
	filter := bson.M{"assignee": user}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxMaintenance
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	if results == nil {
		return []domain.BabyboxMaintenance{}, nil
	}
	return results, nil
}

func (db *DBService) FindMaintenanceByID(id string) (*domain.BabyboxMaintenance, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("maintenances")

	var result domain.BabyboxMaintenance
	filter := bson.M{"_id": id}
	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}
