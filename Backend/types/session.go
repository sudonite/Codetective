package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SessionStatusType int

const (
	Queue SessionStatusType = iota
	Connecting
	WaitingForClient
	Scanning
	Finished
)

type Sessions map[primitive.ObjectID]*Session

type Session struct {
	RepositoryID primitive.ObjectID `json:"repository_id"`
	Directory    string             `json:"directory"`
	Status       SessionStatusType  `json:"status"`
	Message      string             `json:"message"`
	Modified     time.Time          `json:"modified"`
}

type SessionMessage struct {
	Status  SessionStatusType `json:"status"`
	Message string            `json:"message"`
}

type Function struct {
	LineStart int    `json:"lineStart"`
	Code      string `json:"code"`
}
