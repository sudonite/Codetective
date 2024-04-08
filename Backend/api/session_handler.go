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
		msg  types.SessionMessage
		link string
		err  error
	)
	defer c.Close()
	user, err := h.HandleAuthenticate(c)
	if err != nil {
		c.WriteJSON(err)
		return
	}
	session := h.store.Session.GetSession(user)

	go func(c *websocket.Conn, l *string) {
		var recv map[string]string
		for {
			err := c.ReadJSON(&recv)
			if err != nil {
				break
			}
			if _, ok := recv["link"]; ok {
				link = recv["link"]
			}

		}
	}(c, &link)

loop:
	for {
		switch session.Status {
		case types.Queue:
			h.store.Session.ChangeMessage(session, fmt.Sprintf("You are currently number %v in line", h.store.Session.GetPosition(session)))
		case types.Connecting:
			h.store.Session.TouchDate(session)
		case types.WaitingForClient:
			h.store.Session.TouchDate(session)
		}

		msg = types.SessionMessage{
			Status:  session.Status,
			Message: session.Message,
		}
		if err = c.WriteJSON(msg); err != nil {
			break
		}

		switch session.Status {
		case types.Connecting:
			h.ConnectModel(session)
		case types.WaitingForClient:
			h.PrepareRepository(session, link)
		case types.Finished:
			break loop
		}

		time.Sleep(websocketDelay)
	}
}

func (h *SessionHandler) ConnectModel(session *types.Session) {
	h.store.Session.ChangeStatus(session, types.WaitingForClient)
}

func (h *SessionHandler) PrepareRepository(session *types.Session, link string) bool {
	if link == "" {
		return false
	}
	_ = link
	h.store.Session.SessionStarter(session)
	return true
}
