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
	Update(context.Context, Map, Map) error
	GetRepositories(context.Context) ([]*types.Repository, error)
	GetRepositoryByID(context.Context, string) (*types.Repository, error)
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

func (s *MongoRepositoryStore) Update(ctx context.Context, filter Map, update Map) error {
	_, err := s.coll.UpdateOne(ctx, filter, update)
	return err
}

func (s *MongoRepositoryStore) GetRepositories(ctx context.Context) ([]*types.Repository, error) {
	resp, err := s.coll.Find(ctx, bson.M{})
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
