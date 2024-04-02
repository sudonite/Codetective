package db

import (
	"context"
	"os"

	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	gitKeyColl = "gitKey"
	apiKeyColl = "apiKey"
)

type GitKeyStore interface {
	InsertGitKey(context.Context, types.CreateGitKeyParams) (*types.GitKey, error)
	UpdateGitKey(context.Context, Map, types.UpdateGitKeyParams) error
	GetGitKeyByID(context.Context, string) (*types.GitKey, error)
}

type MongoGitKeyStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoGitKeyStore(client *mongo.Client) *MongoGitKeyStore {
	dbName := os.Getenv(MongoDBNameEnvName)
	return &MongoGitKeyStore{
		client: client,
		coll:   client.Database(dbName).Collection(gitKeyColl),
	}
}

func (s *MongoGitKeyStore) InsertGitKey(ctx context.Context, params types.CreateGitKeyParams) (*types.GitKey, error) {
	gitKey := types.NewGitKeyFromParams(params)
	resp, err := s.coll.InsertOne(ctx, gitKey)
	if err != nil {
		return nil, err
	}
	gitKey.ID = resp.InsertedID.(primitive.ObjectID)
	return gitKey, nil
}

func (s *MongoGitKeyStore) UpdateGitKey(ctx context.Context, filter Map, params types.UpdateGitKeyParams) error {
	oid, err := primitive.ObjectIDFromHex(filter["_id"].(string))
	if err != nil {
		return err
	}
	filter["_id"] = oid
	update := Map{"$set": params.ToBSON()}
	_, err = s.coll.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
}

func (s *MongoGitKeyStore) GetGitKeyByID(ctx context.Context, id string) (*types.GitKey, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	filter := Map{"_id": oid}
	var gitKey types.GitKey
	if err = s.coll.FindOne(ctx, filter).Decode(&gitKey); err != nil {
		return nil, err
	}
	return &gitKey, nil
}

type APIKeyStore interface {
	InsertAPIKey(context.Context, types.CreateAPIKeyParams) (*types.APIKey, error)
	UpdateAPIKey(context.Context, Map, types.UpdateAPIKeyParams) error
	GetAPIKeyByID(context.Context, string) (*types.APIKey, error)
}

type MongoAPIKeyStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoAPIKeyStore(client *mongo.Client) *MongoAPIKeyStore {
	dbName := os.Getenv(MongoDBNameEnvName)
	return &MongoAPIKeyStore{
		client: client,
		coll:   client.Database(dbName).Collection(apiKeyColl),
	}
}

func (s *MongoAPIKeyStore) InsertAPIKey(ctx context.Context, params types.CreateAPIKeyParams) (*types.APIKey, error) {
	apiKey := types.NewAPIKeyFromParams(params)
	resp, err := s.coll.InsertOne(ctx, apiKey)
	if err != nil {
		return nil, err
	}
	apiKey.ID = resp.InsertedID.(primitive.ObjectID)
	return apiKey, nil
}

func (s *MongoAPIKeyStore) UpdateAPIKey(ctx context.Context, filter Map, params types.UpdateAPIKeyParams) error {
	oid, err := primitive.ObjectIDFromHex(filter["_id"].(string))
	if err != nil {
		return err
	}
	filter["_id"] = oid
	update := Map{"$set": params.ToBSON()}
	_, err = s.coll.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
}

func (s *MongoAPIKeyStore) GetAPIKeyByID(ctx context.Context, id string) (*types.APIKey, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	filter := Map{"_id": oid}
	var apiKey types.APIKey
	if err = s.coll.FindOne(ctx, filter).Decode(&apiKey); err != nil {
		return nil, err
	}
	return &apiKey, nil
}
