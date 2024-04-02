package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateMessageParams struct {
	UserID   primitive.ObjectID
	Received bool
	Messeage string
	Date     time.Time
}

func NewMessageFromParams(params CreateMessageParams) (*Message, error) {
	return &Message{
		UserID:   params.UserID,
		Received: params.Received,
		Messeage: params.Messeage,
		Date:     params.Date,
	}, nil
}

type Message struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID   primitive.ObjectID `bson:"userID" json:"userID"`
	Received bool               `bson:"received" json:"received"`
	Messeage string             `bson:"messeage" json:"messeage"`
	Date     time.Time          `bson:"date" json:"date"`
}
