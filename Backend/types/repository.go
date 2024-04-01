package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type StatusType int

func (s StatusType) String() string {
	return [...]string{"Clean", "Vulnerable", "Running", "Fixed", "FalsePositive"}[s]
}

const (
	Clean StatusType = iota
	Vulnerable
	Running
	Fixed
	FalsePositive
)

type GitPlatformType int

func (p GitPlatformType) String() string {
	return [...]string{"Github", "Gitlab", "Gitea", "Bitbucket"}[p]
}

const (
	Github GitPlatformType = iota
	Gitlab
	Gitea
	Bitbucket
)

type CreateRepositoryParams struct {
	UserID   primitive.ObjectID `json:"userID"`
	Name     string             `json:"name"`
	URL      string             `json:"url"`
	Status   StatusType         `json:"status"`
	Platform GitPlatformType    `json:"platform"`
	Date     time.Time          `json:"date"`
}

type Repository struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID   primitive.ObjectID `bson:"userID" json:"-"`
	Name     string             `bson:"name" json:"name"`
	URL      string             `bson:"url" json:"url"`
	Status   StatusType         `bson:"status" json:"status"`
	Platform GitPlatformType    `bson:"platform" json:"platform"`
	Date     time.Time          `bson:"date" json:"date"`
}

func NewRepositoryFromParams(params CreateRepositoryParams) (*Repository, error) {
	return &Repository{
		UserID:   params.UserID,
		Name:     params.Name,
		URL:      params.URL,
		Status:   params.Status,
		Platform: params.Platform,
		Date:     params.Date,
	}, nil
}
