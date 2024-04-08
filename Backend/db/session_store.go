package db

import (
	"fmt"
	"sync"
	"time"

	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	maxSessions    = 2
	maxSessionIdle = time.Minute * 5
	cleanerDelay   = time.Minute * 5
	fakeDelay      = time.Millisecond * 200
	fakeIterations = 100
)

type SessionStore interface {
	SessionDaemon()
	SessionCleaner()
	SessionRunner(session *types.Session)
	SessionStarter(session *types.Session)
	SessionStopper(session *types.Session)
	HandleQueue()
	GetSession(user *types.User) *types.Session
	GetPosition(session *types.Session) int
	AddSession(user *types.User) *types.Session
	TouchDate(session *types.Session)
	ChangeStatus(session *types.Session, status types.SessionStatusType)
	ChangeMessage(session *types.Session, message string)
}

type WebsocketSessionStore struct {
	sessions types.Sessions
	sc       chan *types.Session
	fc       chan *types.Session
	mu       *sync.Mutex
}

func NewWebsocketSessionStore(sessions types.Sessions, sc chan *types.Session, fc chan *types.Session, mu *sync.Mutex) *WebsocketSessionStore {
	return &WebsocketSessionStore{sessions, sc, fc, mu}
}

func (s *WebsocketSessionStore) SessionDaemon() {
	for {
		select {
		case session := <-s.sc:
			go s.SessionRunner(session)
		case session := <-s.fc:
			s.SessionFinisher(session)
		}
	}
}

func (s *WebsocketSessionStore) SessionCleaner() {
	for {
		time.Sleep(cleanerDelay)
		for k, v := range s.sessions {
			if time.Since(v.Modified) > maxSessionIdle && v.Status != types.Queue && v.Status != types.Scanning {
				s.mu.Lock()
				delete(s.sessions, k)
				s.mu.Unlock()
			}
		}
		// @TODO: Remove unused folders also here
	}
}

func (s *WebsocketSessionStore) SessionStarter(session *types.Session) {
	s.sc <- session
}

func (s *WebsocketSessionStore) SessionStopper(session *types.Session) {
	s.fc <- session
}

func (s *WebsocketSessionStore) SessionRunner(session *types.Session) {
	s.mu.Lock()
	session.Status = types.Scanning
	s.mu.Unlock()
	for i := 0; i < fakeIterations; i++ {
		s.mu.Lock()
		session.Message = fmt.Sprintf("Iteration %d of %d", i+1, fakeIterations)
		s.mu.Unlock()
		time.Sleep(fakeDelay)
	}
	s.SessionStopper(session)
}

func (s *WebsocketSessionStore) SessionFinisher(session *types.Session) {
	s.mu.Lock()
	session.Status = types.Finished
	session.Modified = time.Now()
	s.mu.Unlock()
	for k, v := range s.sessions {
		if v == session {
			s.mu.Lock()
			delete(s.sessions, k)
			s.mu.Unlock()
			break
		}
	}
	s.HandleQueue()
}

func (s *WebsocketSessionStore) HandleQueue() {
	scanning := 0
	for _, v := range s.sessions {
		if v.Status != types.Queue {
			scanning++
		}
	}
	for i := 0; i < maxSessions-scanning; i++ {
		var key primitive.ObjectID
		for k, v := range s.sessions {
			if v.Status == types.Queue {
				if key == primitive.NilObjectID || v.Modified.Before(s.sessions[key].Modified) {
					key = k
				}
			}
		}
		if key != primitive.NilObjectID {
			s.mu.Lock()
			s.sessions[key].Status = types.Connecting
			s.sessions[key].Message = ""
			s.mu.Unlock()
		}
	}
}

func (s *WebsocketSessionStore) GetSession(user *types.User) *types.Session {
	if session, ok := s.sessions[user.ID]; ok {
		return session
	}
	return s.AddSession(user)
}

func (s *WebsocketSessionStore) GetPosition(session *types.Session) int {
	var (
		position = 1
	)
	for _, v := range s.sessions {
		if v.Status == types.Queue && v.Modified.Before(session.Modified) {
			position++
		}
	}
	return position
}

func (s *WebsocketSessionStore) AddSession(user *types.User) *types.Session {
	defer s.mu.Unlock()
	s.mu.Lock()
	newSession := &types.Session{
		RepositoryID: primitive.NewObjectID(),
		Directory:    "",
		Status:       types.Queue,
		Message:      "",
		Modified:     time.Now(),
	}
	if len(s.sessions) < maxSessions {
		newSession.Status = types.Connecting
	}
	s.sessions[user.ID] = newSession
	return newSession
}

func (s *WebsocketSessionStore) TouchDate(session *types.Session) {
	s.mu.Lock()
	session.Modified = time.Now()
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ChangeStatus(session *types.Session, status types.SessionStatusType) {
	s.mu.Lock()
	session.Status = status
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ChangeMessage(session *types.Session, message string) {
	s.mu.Lock()
	session.Message = message
	s.mu.Unlock()
}
