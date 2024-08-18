package db

import (
	"context"
	"errors"
	"fmt"

	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (db *DBService) InsertIssue(issue domain.BabyboxIssue) (*domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	id, err := utils.GenerateSUID("P-")
	if err != nil {
		return nil, err
	}
	issue.ID = id

	_, err = collection.InsertOne(context.TODO(), issue)
	if err != nil {
		return nil, err
	}

	db.MQPublisher.PublishIssueCreated(issue)

	return &issue, nil
}

// UpdateIssue updates an existing BabyboxIssue
func (db *DBService) UpdateIssue(issue domain.BabyboxIssue) (*domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	if issue.ID == "" {
		return nil, errors.New("issue ID cannot be empty")
	}

	filter := bson.M{"_id": issue.ID}
	update := bson.M{"$set": issue}

	// If assignee is empty string, add it to $unset
	if issue.Assignee == "" {
		update["$unset"] = bson.M{"assignee": ""}
	}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After).SetUpsert(false)

	var updatedIssue domain.BabyboxIssue
	err := collection.FindOneAndUpdate(context.TODO(), filter, update, opts).Decode(&updatedIssue)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("no issue found with ID: %s", issue.ID)
		}
		return nil, fmt.Errorf("error updating issue: %w", err)
	}

	db.MQPublisher.PublishIssueUpdated(updatedIssue)
	return &updatedIssue, nil
}

// DeleteIssue deletes a domain.BabyboxIssue by its ID
func (db *DBService) DeleteIssue(id string) error {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	filter := bson.M{"_id": id}
	var deletedIssue domain.BabyboxIssue
	err := collection.FindOneAndDelete(context.TODO(), filter).Decode(&deletedIssue)
	if err != nil {
		return err
	}

	db.MQPublisher.PublishIssueDeleted(deletedIssue)
	return nil
}

// FindAllIssues gets all domain.BabyboxIssues
func (db *DBService) FindAllIssues() ([]domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	cursor, err := collection.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxIssue
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	if results == nil {
		return []domain.BabyboxIssue{}, nil
	}
	return results, nil
}

func (db *DBService) FindIssueByID(id string) (*domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	var result domain.BabyboxIssue
	filter := bson.M{"_id": id}
	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

// FindIssuesBySlug finds all domain.BabyboxIssues with a specific slug
func (db *DBService) FindIssuesBySlug(slug string) ([]domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	filter := bson.M{"slug": slug}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxIssue
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	if results == nil {
		return []domain.BabyboxIssue{}, nil
	}
	return results, nil
}

// FindIssuesByUsername finds all domain.BabyboxIssues with a specific assignee
func (db *DBService) FindIssuesByUsername(username string) ([]domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	filter := bson.M{"assignee": username}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxIssue
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	if results == nil {
		return []domain.BabyboxIssue{}, nil
	}
	return results, nil
}

func (db *DBService) FindIssuesByMaintenance(maintenance string) ([]domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	filter := bson.M{"maintenance_id": maintenance}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxIssue
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	if results == nil {
		return []domain.BabyboxIssue{}, nil
	}
	return results, nil
}

func (db *DBService) FindMaintenancesUnsolvedOptionallyBySlug(slug string) ([]domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	var filter bson.M
	if slug == "" {
		filter = bson.M{"isSolved": false}
	} else {
		filter = bson.M{"isSolved": false, "slug": slug}
	}

	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxIssue
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	if results == nil {
		return []domain.BabyboxIssue{}, nil
	}
	return results, nil
}
