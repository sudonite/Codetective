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
		Status:       types.Pending,
		Message:      "",
		Started:      time.Now(),
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

func (h *SessionHandler) HandleFindSession(c *websocket.Conn, user *types.User) (*types.Session, bool) {
	fmt.Printf("%+v\n", user)
	if sess, ok := h.sessions[user.ID]; ok {
		fmt.Println("Found session for user", user.ID)
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
		c.Close()
	}
	session, found := h.HandleFindSession(c, user)
	if !found {
		session = h.AddSession(user)
		h.sc <- session
	}

	for {
		if err = c.ReadJSON(&msg); err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				break
			}
		}
		msg = types.SessionMessage{
			Status:  session.Status,
			Message: session.Message,
		}
		if err = c.WriteJSON(msg); err != nil {
			break
		}
		if session.Status == types.Finished {
			break
		}
	}
}

func SessionRunner(session *types.Session, fc chan *types.Session) {
	var (
		maxIterations = 100
	)
	for i := 0; i < maxIterations; i++ {
		session.Message = fmt.Sprintf("Iteration %d of %d", i+1, maxIterations)
		time.Sleep(time.Second * 10)
	}
	fc <- session
}

func SessionStopper(sessions types.Sessions, session *types.Session, sc chan *types.Session) {
	session.Status = types.Finished
	for k, v := range sessions {
		if v == session {
			delete(sessions, k)
			break
		}
	}
	//@TODO: move from queue to sessions here
	//sc <- session
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
