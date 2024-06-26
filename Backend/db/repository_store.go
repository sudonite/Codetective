package db

import (
	"context"
	"os"

	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const repositoryColl = "repository"

type RepositoryStore interface {
	InsertRepository(context.Context, *types.Repository) (*types.Repository, error)
	UpdateRepository(context.Context, Map, types.UpdateRepositoryParams) error
	GetRepositories(context.Context, string) ([]*types.Repository, error)
	GetRepositoryByID(context.Context, string) (*types.Repository, error)
	DeleteRepositoryByID(context.Context, string) error
}

type MongoRepositoryStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoRepositoryStore(client *mongo.Client) *MongoRepositoryStore {
	dbname := os.Getenv(MongoDBNameEnvName)
	return &MongoRepositoryStore{
		client: client,
		coll:   client.Database(dbname).Collection(repositoryColl),
	}
}

func (s *MongoRepositoryStore) InsertRepository(ctx context.Context, repository *types.Repository) (*types.Repository, error) {
	resp, err := s.coll.InsertOne(ctx, repository)
	if err != nil {
		return nil, err
	}
	repository.ID = resp.InsertedID.(primitive.ObjectID)
	return repository, nil
}

func (s *MongoRepositoryStore) UpdateRepository(ctx context.Context, filter Map, params types.UpdateRepositoryParams) error {
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

func (s *MongoRepositoryStore) GetRepositories(ctx context.Context, id string) ([]*types.Repository, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	filter := bson.M{"userID": oid}
	resp, err := s.coll.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var repositories []*types.Repository
	if err := resp.All(ctx, &repositories); err != nil {
		return nil, err
	}
	return repositories, nil
}

func (s *MongoRepositoryStore) GetRepositoryByID(ctx context.Context, id string) (*types.Repository, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var repository types.Repository
	if err := s.coll.FindOne(ctx, bson.M{"_id": oid}).Decode(&repository); err != nil {
		return nil, err
	}
	return &repository, nil
}

func (s *MongoRepositoryStore) DeleteRepositoryByID(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = s.coll.DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		return err
	}
	return nil
}
