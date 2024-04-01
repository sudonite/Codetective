package db

import (
	"context"
	"os"

	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const codeColl = "code"

type CodeStore interface {
	InsertCode(context.Context, *types.Code) (*types.Code, error)
	UpdateCode(context.Context, Map, types.UpdateCodeParams) error
	GetCodesByFileID(context.Context, string) ([]*types.Code, error)
}

type MongoCodeStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoCodeStore(client *mongo.Client) *MongoCodeStore {
	dbname := os.Getenv(MongoDBNameEnvName)
	return &MongoCodeStore{
		client: client,
		coll:   client.Database(dbname).Collection(codeColl),
	}
}

func (s *MongoCodeStore) InsertCode(ctx context.Context, code *types.Code) (*types.Code, error) {
	resp, err := s.coll.InsertOne(ctx, code)
	if err != nil {
		return nil, err
	}
	code.ID = resp.InsertedID.(primitive.ObjectID)
	return code, nil
}

func (s *MongoCodeStore) UpdateCode(ctx context.Context, filter Map, params types.UpdateCodeParams) error {
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

func (s *MongoCodeStore) GetCodesByFileID(ctx context.Context, id string) ([]*types.Code, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	resp, err := s.coll.Find(ctx, bson.M{"fileID": oid})
	if err != nil {
		return nil, err
	}
	var codes []*types.Code
	if err := resp.All(ctx, &codes); err != nil {
		return nil, err
	}
	return codes, nil
}
