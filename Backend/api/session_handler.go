package api

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	maxSessions    = 2
	maxSessionIdle = time.Minute * 5
	cleanerDelay   = time.Minute * 5
	websocketDelay = time.Millisecond * 500
	fakeDelay      = time.Millisecond * 500
	fakeIterations = 100
)

type SessionHandler struct {
	store    *db.Store
	sessions types.Sessions
	sc       chan *types.Session
	fc       chan *types.Session
}

func NewSessionHandler(store *db.Store, sessions types.Sessions, sc chan *types.Session, fc chan *types.Session) *SessionHandler {
	return &SessionHandler{store, sessions, sc, fc}
}

func (h *SessionHandler) HandleUpgradeConnection(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		return c.Next()
	}
	return fiber.ErrUpgradeRequired
}

func (h *SessionHandler) AddSession(user *types.User) *types.Session {
	newSession := &types.Session{
		RepositoryID: primitive.NewObjectID(),
		Directory:    "",
		Status:       types.Queue,
		Message:      "",
		Modified:     time.Now(),
	}
	if len(h.sessions) < maxSessions {
		newSession.Status = types.Connecting
	}
	h.sessions[user.ID] = newSession
	return newSession
}

func (h *SessionHandler) HandleAuthenticate(c *websocket.Conn) (*types.User, error) {
	token := c.Headers("Authorization")
	if token == "" {
		return nil, ErrUnAuthorized()
	}
	claims, err := validateToken(token[7:])
	if err != nil {
		return nil, err
	}
	expiresFloat := claims["exp"].(float64)
	expires := int64(expiresFloat)

	if time.Now().Unix() > expires {
		return nil, NewError(http.StatusUnauthorized, "token expired")
	}
	userID := claims["id"].(string)
	user, err := h.store.User.GetUserByID(context.Background(), userID)
	if err != nil {
		return nil, ErrUnAuthorized()
	}
	return user, nil
}

func (h *SessionHandler) HandleFindSession(user *types.User) (*types.Session, bool) {
	if sess, ok := h.sessions[user.ID]; ok {
		return sess, true
	}
	return nil, false
}

func (h *SessionHandler) HandleSession(c *websocket.Conn) {
	var (
		msg types.SessionMessage
		err error
	)
	defer c.Close()
	user, err := h.HandleAuthenticate(c)
	if err != nil {
		c.WriteJSON(err)
		return
	}
	session, found := h.HandleFindSession(user)
	if !found {
		session = h.AddSession(user)
	}

	for {
		// @TODO: Implement mutex for session
		if session.Status == types.Queue {
			msg = types.SessionMessage{
				Status:  types.Queue,
				Message: fmt.Sprintf("You are currently number %v in line", getQueuePosition(h.sessions, session)),
			}
			if err = c.WriteJSON(msg); err != nil {
				break
			}
		}

		if session.Status == types.Connecting {
			session.Modified = time.Now()
			msg = types.SessionMessage{
				Status:  types.Connecting,
				Message: "",
			}
			if err = c.WriteJSON(msg); err != nil {
				break
			}
			if pingModel() {
				session.Status = types.WaitingForClient
			} else {
				break
			}
		}

		if session.Status == types.WaitingForClient {
			session.Modified = time.Now()
			msg = types.SessionMessage{
				Status:  types.WaitingForClient,
				Message: "",
			}
			if err = c.WriteJSON(msg); err != nil {
				break
			}
			if err = c.ReadJSON(&msg); err != nil {
				break
			}
			if ok := cloneRepository(session, msg.Message); ok {
				session.Status = types.Scanning
				h.sc <- session
			}
		}

		if session.Status == types.Scanning {
			msg = types.SessionMessage{
				Status:  session.Status,
				Message: session.Message,
			}
			if err = c.WriteJSON(msg); err != nil {
				break
			}
		}

		if session.Status == types.Finished {
			msg = types.SessionMessage{
				Status:  session.Status,
				Message: "",
			}
			c.WriteJSON(msg)
			break
		}
		time.Sleep(websocketDelay)
	}
}

func cloneRepository(session *types.Session, repoURL string) bool {
	_ = repoURL
	session.Directory = "path/to/cloned/repo"
	return true
}

func pingModel() bool {
	return true
}

func getQueuePosition(sessions types.Sessions, session *types.Session) int {
	var (
		position = 1
	)
	for _, v := range sessions {
		if v.Status == types.Queue && v.Modified.Before(session.Modified) {
			position++
		}
	}
	return position
}

func HandleQueue(sessions types.Sessions, sc chan *types.Session) {
	scanning := 0
	for _, v := range sessions {
		if v.Status != types.Queue {
			scanning++
		}
	}
	for i := 0; i < maxSessions-scanning; i++ {
		var key primitive.ObjectID
		for k, v := range sessions {
			if v.Status == types.Queue {
				if key == primitive.NilObjectID || v.Modified.Before(sessions[key].Modified) {
					key = k
				}
			}
		}
		if key != primitive.NilObjectID {
			sessions[key].Status = types.Connecting
		}
	}
}

func SessionRunner(session *types.Session, fc chan *types.Session) {
	for i := 0; i < fakeIterations; i++ {
		session.Message = fmt.Sprintf("Iteration %d of %d", i+1, fakeIterations)
		time.Sleep(fakeDelay)
	}
	fc <- session
}

func SessionStopper(sessions types.Sessions, session *types.Session, sc chan *types.Session) {
	session.Status = types.Finished
	session.Modified = time.Now()
	for k, v := range sessions {
		if v == session {
			delete(sessions, k)
			break
		}
	}
	HandleQueue(sessions, sc)
}

func SessionDaemon(sessions types.Sessions, sc chan *types.Session, fc chan *types.Session) {
	for {
		select {
		case session := <-sc:
			go SessionRunner(session, fc)
		case session := <-fc:
			SessionStopper(sessions, session, sc)
		}
	}
}

func SessionCleaner(sessions types.Sessions) {
	for {
		time.Sleep(cleanerDelay)
		for k, v := range sessions {
			if time.Since(v.Modified) > maxSessionIdle && (v.Status == types.WaitingForClient ||
				v.Status == types.Finished || v.Status == types.Connecting) {
				delete(sessions, k)
			}
		}
		// @TODO: Remove unused folders also here
	}
}
