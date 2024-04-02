package db

import (
	"context"
	"os"

	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const messageColl = "message"

type MessageStore interface {
	InsertMessage(context.Context, types.CreateMessageParams) (*types.Message, error)
	GetMessageByCodeID(context.Context, string) (*types.Message, error)
}

type MongoMessageStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoMessageStore(client *mongo.Client) *MongoMessageStore {
	dbName := os.Getenv(MongoDBNameEnvName)
	return &MongoMessageStore{
		client: client,
		coll:   client.Database(dbName).Collection(messageColl),
	}
}

func (s *MongoMessageStore) InsertMessage(ctx context.Context, params types.CreateMessageParams) (*types.Message, error) {
	message, err := types.NewMessageFromParams(params)
	if err != nil {
		return nil, err
	}
	resp, err := s.coll.InsertOne(ctx, message)
	if err != nil {
		return nil, err
	}
	message.ID = resp.InsertedID.(primitive.ObjectID)
	return message, nil
}

func (s *MongoMessageStore) GetMessageByCodeID(ctx context.Context, id string) (*types.Message, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	filter := Map{"_id": oid}
	var message types.Message
	if err = s.coll.FindOne(ctx, filter).Decode(&message); err != nil {
		return nil, err
	}
	return &message, nil
}
