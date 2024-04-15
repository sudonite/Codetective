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
	UpdateFile(context.Context, Map, types.UpdateFileParams) error
	GetFilesByRepositoryID(context.Context, string) ([]*types.File, error)
	GetFileByID(context.Context, string) (*types.File, error)
	GetFileByParams(context.Context, string, string, string, string) (*types.File, error)
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

func (s *MongoFileStore) UpdateFile(ctx context.Context, filter Map, params types.UpdateFileParams) error {
	oid, err := primitive.ObjectIDFromHex(filter["_id"].(string))
	if err != nil {
		return err
	}
	filter["_id"] = oid
	update := bson.M{"$set": params.ToBSON()}
	_, err = s.coll.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
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

func (s *MongoFileStore) GetFileByID(ctx context.Context, id string) (*types.File, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	resp := s.coll.FindOne(ctx, bson.M{"_id": oid})
	var file *types.File
	if err := resp.Decode(&file); err != nil {
		return nil, err
	}
	return file, nil
}

func (s *MongoFileStore) GetFileByParams(ctx context.Context, repoID string, path string, name string, ext string) (*types.File, error) {
	oid, err := primitive.ObjectIDFromHex(repoID)
	if err != nil {
		return nil, err
	}
	resp := s.coll.FindOne(ctx, bson.M{"repositoryID": oid, "path": path, "name": name, "extension": ext})
	var f *types.File
	if err := resp.Decode(&f); err != nil {
		return nil, err
	}
	return f, nil
}
