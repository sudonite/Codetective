package db

import (
	"context"
	"os"
	"time"

	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	gitKeyColl = "gitKey"
)

type GitKeyStore interface {
	InsertGitKey(context.Context, *types.GitKey) (*types.GitKey, error)
	UpdateGitKey(context.Context, Map, types.UpdateGitKeyParams) error
	GetGitKeyByID(context.Context, string) (*types.GitKey, error)
	GetGitKeysByUserID(context.Context, string) ([]*types.GitKey, error)
	GetGitKeyByPlatform(context.Context, *types.User, types.GitPlatformType) (*types.GitKey, error)
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

func (s *MongoGitKeyStore) GetGitKeyByPlatform(ctx context.Context, user *types.User, platform types.GitPlatformType) (*types.GitKey, error) {
	filter := Map{"userID": user.ID, "platform": platform}
	var gitKey types.GitKey
	if err := s.coll.FindOne(ctx, filter).Decode(&gitKey); err != nil {
		return nil, err
	}
	return &gitKey, nil
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
