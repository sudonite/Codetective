package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type APIPlatformType int

func (p APIPlatformType) String() string {
	return [...]string{"OpenAI", "Perplexity"}[p]
}

const (
	OpenAI APIPlatformType = iota
	Perplexity
)

type CreateGitKeyParams struct {
	UserID     primitive.ObjectID `json:"userID"`
	PublicKey  string             `json:"publicKey"`
	PrivateKey string             `json:"privateKey"`
	Platform   GitPlatformType    `json:"platform"`
	Date       time.Time          `json:"date"`
}

type UpdateGitKeyParams struct {
	PublicKey  string `json:"publicKey"`
	PrivateKey string `json:"privateKey"`
}

func (p UpdateGitKeyParams) ToBSON() bson.M {
	return bson.M{"publicKey": p.PublicKey, "privateKey": p.PrivateKey}
}

func NewGitKeyFromParams(params CreateGitKeyParams) *GitKey {
	return &GitKey{
		UserID:     params.UserID,
		PublicKey:  params.PublicKey,
		PrivateKey: params.PrivateKey,
		Platform:   params.Platform,
		Date:       params.Date,
	}
}

type GitKey struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID     primitive.ObjectID `bson:"userID" json:"userID"`
	PublicKey  string             `bson:"publicKey" json:"publicKey"`
	PrivateKey string             `bson:"privateKey" json:"privateKey"`
	Platform   GitPlatformType    `bson:"platform" json:"platform"`
	Date       time.Time          `bson:"date" json:"date"`
}

type CreateAPIKeyParams struct {
	UserID   primitive.ObjectID `json:"userID"`
	Key      string             `json:"key"`
	Platform APIPlatformType    `json:"platform"`
	Date     time.Time          `json:"date"`
}

type UpdateAPIKeyParams struct {
	Key string `json:"key"`
}

func (p UpdateAPIKeyParams) ToBSON() bson.M {
	return bson.M{"key": p.Key}
}

func NewAPIKeyFromParams(params CreateAPIKeyParams) *APIKey {
	return &APIKey{
		UserID:   params.UserID,
		Key:      params.Key,
		Platform: params.Platform,
		Date:     params.Date,
	}
}

type APIKey struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID   primitive.ObjectID `bson:"userID" json:"userID"`
	Key      string             `bson:"key" json:"key"`
	Platform APIPlatformType    `bson:"platform" json:"platform"`
	Date     time.Time          `bson:"date" json:"date"`
}
