package db

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	gitKeyColl = "gitKey"
	apiKeyColl = "apiKey"
)

type GitKeyStore interface {
	InsertGitKey(context.Context, *types.GitKey) (*types.GitKey, error)
	UpdateGitKey(context.Context, Map, types.UpdateGitKeyParams) error
	GetGitKeyByID(context.Context, string) (*types.GitKey, error)
	GetGitKeysByUserID(context.Context, string) ([]*types.GitKey, error)
	InsertEmptyGitKeys(context.Context, primitive.ObjectID) error
	DeleteGitKey(context.Context, string) error
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

func (s *MongoGitKeyStore) InsertGitKey(ctx context.Context, gitKey *types.GitKey) (*types.GitKey, error) {
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

func (s *MongoGitKeyStore) GetGitKeysByUserID(ctx context.Context, id string) ([]*types.GitKey, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	filter := Map{"userID": oid}
	resp, err := s.coll.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var gitKeys []*types.GitKey
	if err = resp.All(ctx, &gitKeys); err != nil {
		return nil, err
	}
	return gitKeys, nil
}

func (s *MongoGitKeyStore) DeleteGitKey(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := Map{"_id": oid}
	update := Map{"$set": types.UpdateGitKeyParams{PublicKey: "", PrivateKey: "", Date: time.Now()}.ToBSON()}
	_, err = s.coll.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
}

func (s *MongoGitKeyStore) InsertEmptyGitKeys(ctx context.Context, userID primitive.ObjectID) error {
	_, err := s.coll.InsertOne(ctx, types.GitKey{
		UserID:     userID,
		PublicKey:  "",
		PrivateKey: "",
		Platform:   types.GitPlatformType(types.Github),
		Date:       time.Now(),
	})
	if err != nil {
		return err
	}
	_, err = s.coll.InsertOne(ctx, types.GitKey{
		UserID:     userID,
		PublicKey:  "",
		PrivateKey: "",
		Platform:   types.GitPlatformType(types.Gitlab),
		Date:       time.Now(),
	})
	if err != nil {
		return err
	}
	_, err = s.coll.InsertOne(ctx, types.GitKey{
		UserID:     userID,
		PublicKey:  "",
		PrivateKey: "",
		Platform:   types.GitPlatformType(types.Gitea),
		Date:       time.Now(),
	})
	if err != nil {
		return err
	}
	_, err = s.coll.InsertOne(ctx, types.GitKey{
		UserID:     userID,
		PublicKey:  "",
		PrivateKey: "",
		Platform:   types.GitPlatformType(types.Bitbucket),
		Date:       time.Now(),
	})
	if err != nil {
		return err
	}
	return nil
}

type APIKeyStore interface {
	InsertAPIKey(context.Context, *types.APIKey) (*types.APIKey, error)
	UpdateAPIKey(context.Context, Map, types.UpdateAPIKeyParams) error
	GetAPIKeyByID(context.Context, string) (*types.APIKey, error)
	GetAPIKeysByUserID(context.Context, string) ([]*types.APIKey, error)
	InsertEmptyAPIKeys(context.Context, primitive.ObjectID) error
	DeleteAPIKey(context.Context, string) error
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

func (s *MongoAPIKeyStore) InsertAPIKey(ctx context.Context, apiKey *types.APIKey) (*types.APIKey, error) {
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
		fmt.Println("5")
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

func (s *MongoAPIKeyStore) GetAPIKeysByUserID(ctx context.Context, id string) ([]*types.APIKey, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	filter := Map{"userID": oid}
	resp, err := s.coll.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var apiKeys []*types.APIKey
	if err = resp.All(ctx, &apiKeys); err != nil {
		return nil, err
	}
	return apiKeys, nil
}

func (s *MongoAPIKeyStore) DeleteAPIKey(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := Map{"_id": oid}
	update := Map{"$set": types.UpdateAPIKeyParams{Key: "", Date: time.Now()}.ToBSON()}
	_, err = s.coll.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
}

func (s *MongoAPIKeyStore) InsertEmptyAPIKeys(ctx context.Context, userID primitive.ObjectID) error {
	_, err := s.coll.InsertOne(ctx, types.APIKey{
		UserID:   userID,
		Key:      "",
		Platform: types.APIPlatformType(types.Colab),
		Date:     time.Now(),
	})
	if err != nil {
		return err
	}
	_, err = s.coll.InsertOne(ctx, types.APIKey{
		UserID:   userID,
		Key:      "",
		Platform: types.APIPlatformType(types.Kaggle),
		Date:     time.Now(),
	})
	if err != nil {
		return err
	}
	_, err = s.coll.InsertOne(ctx, types.APIKey{
		UserID:   userID,
		Key:      "",
		Platform: types.APIPlatformType(types.OpenAI),
		Date:     time.Now(),
	})
	if err != nil {
		return err
	}
	_, err = s.coll.InsertOne(ctx, types.APIKey{
		UserID:   userID,
		Key:      "",
		Platform: types.APIPlatformType(types.Perplexity),
		Date:     time.Now(),
	})
	if err != nil {
		return err
	}
	return nil
}
