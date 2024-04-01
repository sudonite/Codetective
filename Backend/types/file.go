package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateFileParams struct {
	RepositoryID primitive.ObjectID
	Name         string
	Path         string
	Extension    string
	Status       StatusType
	Date         time.Time
}

type File struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	RepositoryID primitive.ObjectID `bson:"repositoryID" json:"repositoryID"`
	Name         string             `bson:"name" json:"name"`
	Path         string             `bson:"path" json:"path"`
	Extension    string             `bson:"extension" json:"extension"`
	Status       StatusType         `bson:"status" json:"status"`
	Date         time.Time          `bson:"date" json:"date"`
}

func NewFileFromParams(params CreateFileParams) (*File, error) {
	return &File{
		RepositoryID: params.RepositoryID,
		Name:         params.Name,
		Path:         params.Path,
		Extension:    params.Extension,
		Status:       params.Status,
		Date:         params.Date,
	}, nil
}
