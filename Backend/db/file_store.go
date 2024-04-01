package db

import (
	"context"
	"os"

	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const fileColl = "file"

type FileStore interface {
	InsertFile(context.Context, *types.File) (*types.File, error)
	Update(context.Context, Map, Map) error
	GetFilesByRepositoryID(context.Context, string) ([]*types.File, error)
}

type MongoFileStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoFileStore(client *mongo.Client) *MongoFileStore {
	dbname := os.Getenv(MongoDBNameEnvName)
	return &MongoFileStore{
		client: client,
		coll:   client.Database(dbname).Collection(fileColl),
	}
}

func (s *MongoFileStore) InsertFile(ctx context.Context, file *types.File) (*types.File, error) {
	resp, err := s.coll.InsertOne(ctx, file)
	if err != nil {
		return nil, err
	}
	file.ID = resp.InsertedID.(primitive.ObjectID)
	return file, nil
}

func (s *MongoFileStore) Update(ctx context.Context, filter Map, update Map) error {
	_, err := s.coll.UpdateOne(ctx, filter, update)
	return err
}

func (s *MongoFileStore) GetFilesByRepositoryID(ctx context.Context, id string) ([]*types.File, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	resp, err := s.coll.Find(ctx, bson.M{"repositoryID": oid})
	if err != nil {
		return nil, err
	}
	var files []*types.File
	if err := resp.All(ctx, &files); err != nil {
		return nil, err
	}
	return files, nil
}
