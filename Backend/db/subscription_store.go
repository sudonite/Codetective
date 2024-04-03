package db

import (
	"context"
	"os"

	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const subscriptionColl = "subscriptions"

type SubscriptionStore interface {
	GetSubscriptionByID(context.Context, string) (*types.Subscription, error)
	GetSubscriptionByUserID(context.Context, string) (*types.Subscription, error)
	InsertSubscription(context.Context, *types.Subscription) (*types.Subscription, error)
	EditSubscription(context.Context, Map, types.UpdateSubscriptionParams) error
}

type MongoSubscriptionStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoSubscriptionStore(client *mongo.Client) *MongoSubscriptionStore {
	dbName := os.Getenv(MongoDBNameEnvName)
	return &MongoSubscriptionStore{
		client: client,
		coll:   client.Database(dbName).Collection(subscriptionColl),
	}
}

func (s *MongoSubscriptionStore) GetSubscriptionByID(ctx context.Context, id string) (*types.Subscription, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var subscription types.Subscription
	if err := s.coll.FindOne(ctx, bson.M{"_id": oid}).Decode(&subscription); err != nil {
		return nil, err
	}
	return &subscription, nil
}

func (s *MongoSubscriptionStore) GetSubscriptionByUserID(ctx context.Context, userID string) (*types.Subscription, error) {
	oid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	var subscription types.Subscription
	if err := s.coll.FindOne(ctx, bson.M{"userID": oid}).Decode(&subscription); err != nil {
		return nil, err
	}
	return &subscription, nil
}

func (s *MongoSubscriptionStore) InsertSubscription(ctx context.Context, subscription *types.Subscription) (*types.Subscription, error) {
	res, err := s.coll.InsertOne(ctx, subscription)
	if err != nil {
		return nil, err
	}
	subscription.ID = res.InsertedID.(primitive.ObjectID)
	return subscription, nil
}

func (s *MongoSubscriptionStore) EditSubscription(ctx context.Context, filter Map, params types.UpdateSubscriptionParams) error {
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
