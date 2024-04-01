package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ApiPlatformType int

func (p ApiPlatformType) String() string {
	return [...]string{"OpenAI", "Perplexity"}[p]
}

const (
	OpenAI ApiPlatformType = iota
	Perplexity
)

type GitKey struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID     primitive.ObjectID `bson:"userID" json:"userID"`
	PublicKey  string             `bson:"publicKey" json:"publicKey"`
	PrivateKey string             `bson:"privateKey" json:"privateKey"`
	Platform   GitPlatformType    `bson:"platform" json:"platform"`
	Date       time.Time          `bson:"date" json:"date"`
}

type APIKey struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID   primitive.ObjectID `bson:"userID" json:"userID"`
	Key      string             `bson:"key" json:"key"`
	Platform ApiPlatformType    `bson:"platform" json:"platform"`
	Date     time.Time          `bson:"date" json:"date"`
}
