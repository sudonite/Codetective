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
)

const (
	websocketDelay = time.Millisecond * 500
)

type SessionHandler struct {
	store *db.Store
}

func NewSessionHandler(store *db.Store) *SessionHandler {
	return &SessionHandler{store}
}

func (h *SessionHandler) HandleUpgradeConnection(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		return c.Next()
	}
	return fiber.ErrUpgradeRequired
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
	session, found := h.store.Session.GetSession(user)
	if !found {
		session = h.store.Session.AddSession(user)
	}

	for {
		if session.Status == types.Queue {
			msg = types.SessionMessage{
				Status:  types.Queue,
				Message: fmt.Sprintf("You are currently number %v in line", h.store.Session.GetPosition(session)),
			}
			if err = c.WriteJSON(msg); err != nil {
				break
			}
		}

		if session.Status == types.Connecting {
			h.store.Session.TouchDate(session)
			msg = types.SessionMessage{
				Status:  types.Connecting,
				Message: "",
			}
			if err = c.WriteJSON(msg); err != nil {
				break
			}
			if pingModel() {
				h.store.Session.ChangeStatus(session, types.WaitingForClient)
			} else {
				break
			}
		}

		if session.Status == types.WaitingForClient {
			h.store.Session.TouchDate(session)
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
				h.store.Session.SessionStarter(session)
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
