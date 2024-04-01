package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID   primitive.ObjectID `bson:"userID" json:"userID"`
	Received bool               `bson:"received" json:"received"`
	Messeage string             `bson:"messeage" json:"messeage"`
	Date     time.Time          `bson:"date" json:"date"`
}
