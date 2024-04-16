package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type APIPlatformType int

func (p APIPlatformType) String() string {
	return [...]string{"Colab", "Kaggle", "OpenAI", "Perplexity"}[p]
}

const (
	Colab APIPlatformType = iota
	Kaggle
	OpenAI
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
	PublicKey  string    `json:"publicKey"`
	PrivateKey string    `json:"privateKey"`
	Date       time.Time `json:"date"`
}

func (p UpdateGitKeyParams) ToBSON() bson.M {
	return bson.M{"publicKey": p.PublicKey, "privateKey": p.PrivateKey, "date": p.Date}
}

func NewGitKeyFromParams(params CreateGitKeyParams) (*GitKey, error) {
	return &GitKey{
		UserID:     params.UserID,
		PublicKey:  params.PublicKey,
		PrivateKey: params.PrivateKey,
		Platform:   params.Platform,
		Date:       params.Date,
	}, nil
}

type GitKey struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID     primitive.ObjectID `bson:"userID" json:"-"`
	PublicKey  string             `bson:"publicKey" json:"key"`
	PrivateKey string             `bson:"privateKey" json:"-"`
	Platform   GitPlatformType    `bson:"platform" json:"platform"`
	Date       time.Time          `bson:"date" json:"date"`
}
