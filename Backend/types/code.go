package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UpdateCodeParams struct {
	Status StatusType `json:"status"`
}

func (p UpdateCodeParams) ToBSON() bson.M {
	return bson.M{"status": p.Status}
}

type CreateCodeParams struct {
	FileID    primitive.ObjectID `json:"fileID"`
	Status    StatusType         `json:"status"`
	LineStart int                `json:"lineStart"`
	Code      string             `json:"code"`
	Date      time.Time          `json:"date"`
}

type Code struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	FileID    primitive.ObjectID `bson:"fileID" json:"fileID"`
	Status    StatusType         `bson:"status" json:"status"`
	LineStart int                `bson:"lineStart" json:"lineStart"`
	Code      string             `bson:"code" json:"code"`
	Date      time.Time          `bson:"date" json:"date"`
}

func NewCodeFromParams(params CreateCodeParams) (*Code, error) {
	return &Code{
		FileID:    params.FileID,
		Status:    params.Status,
		LineStart: params.LineStart,
		Code:      params.Code,
		Date:      params.Date,
	}, nil
}
