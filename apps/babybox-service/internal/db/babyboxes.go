package db

import (
	"context"
	"time"

	"github.com/zbyju/babybox-dashboard/apps/babybox-service/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const babyboxCollectionName = "babyboxes"

// InsertBabybox inserts a new Babybox with minimal data
func (db *DBService) InsertBabybox(slug string, name string) (*domain.Babybox, error) {
	collection := db.Client.Database(db.DatabaseName).Collection(babyboxCollectionName)

	if name == "" {
		name = slug
	}

	newBabybox := domain.Babybox{
		ID:        primitive.NewObjectID(), // MongoDB generates the ID
		Slug:      slug,
		Name:      name,
		CreatedAt: time.Now().In(db.TimeLocation),
	}

	_, err := collection.InsertOne(context.TODO(), newBabybox)
	if err != nil {
		return nil, err
	}

	// Note: You might fetch the inserted object to return the generated ID if needed
	return &newBabybox, nil
}

// UpdateBabybox updates existing Babybox data
func (db *DBService) UpdateBabybox(babybox domain.Babybox) (*domain.Babybox, error) {
	collection := db.Client.Database(db.DatabaseName).Collection(babyboxCollectionName)

  if babybox.Contacts != nil && len(*babybox.Contacts) == 0 {
    babybox.Contacts = &[]domain.Contact{}
  }

	filter := bson.M{"slug": babybox.Slug}
	update := bson.M{"$set": babybox}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After) // Key option

	var updatedBabybox domain.Babybox
	err := collection.FindOneAndUpdate(context.TODO(), filter, update, opts).Decode(&updatedBabybox)
	if err != nil {
		return nil, err
	}

	return &updatedBabybox, nil
}

// FindBabyboxBySlug finds a single Babybox by its slug
func (db *DBService) FindBabyboxBySlug(slug string) (*domain.Babybox, error) {
	collection := db.Client.Database(db.DatabaseName).Collection(babyboxCollectionName)

	var result domain.Babybox
	filter := bson.M{"slug": slug}
	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

// FindAllBabyboxes gets all Babyboxes (full data)
func (db *DBService) FindAllBabyboxes() ([]domain.Babybox, error) {
	collection := db.Client.Database(db.DatabaseName).Collection(babyboxCollectionName)

	cursor, err := collection.Find(context.TODO(), bson.D{}) // No filters, get everything
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO()) // Important to close the cursor

	var results []domain.Babybox
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

// FindBabyboxesBasic gets all Babyboxes (only slug and name)
func (db *DBService) FindBabyboxesNames() ([]domain.Babybox, error) {
	collection := db.Client.Database(db.DatabaseName).Collection(babyboxCollectionName)

	// Projection to include only the slug and name
	projection := bson.D{primitive.E{Key: "slug", Value: 1}, primitive.E{Key: "name", Value: 1}}

	cursor, err := collection.Find(context.TODO(), bson.D{}, options.Find().SetProjection(projection))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []domain.Babybox
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}
