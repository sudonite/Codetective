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
	Error
)

type Sessions map[primitive.ObjectID]*Session

type Session struct {
	RepositoryID primitive.ObjectID `json:"repository_id"`
	Directory    string             `json:"directory"`
	Files        []FileFuncType     `json:"file_functions"`
	Status       SessionStatusType  `json:"status"`
	Message      string             `json:"message"`
	Modified     time.Time          `json:"modified"`
}

type FileFuncType struct {
	Path    string         `json:"file_name"`
	FuncPos []FuncPostType `json:"positions"`
}

type FuncPostType struct {
	StartByte uint32 `json:"start_byte"`
	EndByte   uint32 `json:"end_byte"`
}

type SessionMessage struct {
	Status  SessionStatusType `json:"status"`
	Message string            `json:"message"`
}
