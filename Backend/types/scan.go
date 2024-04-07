package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SessionStatusType int

const (
	Pending SessionStatusType = iota
	Queue
	Connecting
	Waiting
	Scanning
	Finished
)

type Sessions map[primitive.ObjectID]*Session

type Session struct {
	RepositoryID primitive.ObjectID `json:"repository_id"`
	Directory    string             `json:"directory"`
	Status       SessionStatusType  `json:"status"`
	Message      string             `json:"message"`
	Started      time.Time          `json:"started"`
}

type SessionMessage struct {
	Status  SessionStatusType `json:"status"`
	Message string            `json:"message"`
}

type Function struct {
	LineStart int    `json:"lineStart"`
	Code      string `json:"code"`
}
