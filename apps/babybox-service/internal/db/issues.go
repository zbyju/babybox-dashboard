package db

import (
	"context"

	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
	"github.com/zbyju/babybox-dashboard/apps/babybox-service/utils"

	"go.mongodb.org/mongo-driver/bson"
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

	return &issue, nil
}

// UpdateIssue updates an existing BabyboxIssue
func (db *DBService) UpdateIssue(issue domain.BabyboxIssue) (*domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	filter := bson.M{"_id": issue.ID}
	update := bson.M{"$set": issue}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

	var updatedIssue domain.BabyboxIssue
	err := collection.FindOneAndUpdate(context.TODO(), filter, update, opts).Decode(&updatedIssue)
	if err != nil {
		return nil, err
	}

	return &updatedIssue, nil
}

// DeleteIssue deletes a domain.BabyboxIssue by its ID
func (db *DBService) DeleteIssue(id string) error {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	filter := bson.M{"_id": id}
	_, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return err
	}

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

	return results, nil
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

	return results, nil
}

func (db *DBService) FindIssuesByMaintenance(maintenance string) ([]domain.BabyboxIssue, error) {
	collection := db.Client.Database(db.DatabaseName).Collection("issues")

	filter := bson.M{"maintenance": maintenance}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.BabyboxIssue
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
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

	return results, nil
}
