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
	websocketReadDelay  = time.Millisecond * 10
	websocketWriteDelay = time.Millisecond * 500
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
	token := c.Query("token")
	if token == "" {
		return nil, ErrUnAuthorized()
	}
	claims, err := validateToken(token)
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
		msg     types.SessionMessage
		err     error
		running = true
	)
	defer c.Close()

	user, err := h.HandleAuthenticate(c)
	if err != nil {
		c.WriteJSON(err)
		return
	}

	session := h.store.Session.GetSession(user)

	go h.MessageReader(c, session)

	for running {
		switch session.Status {
		case types.Queue:
			h.UpdateQueue(session)
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
		case types.Finished:
			running = false
		}

		time.Sleep(websocketWriteDelay)
	}
}

func (h *SessionHandler) ConnectModel(session *types.Session) {
	h.store.Session.ChangeStatus(session, types.WaitingForClient)
}

func (h *SessionHandler) UpdateQueue(session *types.Session) {
	h.store.Session.ChangeMessage(session, fmt.Sprintf("You are currently number %v in line", h.store.Session.GetPosition(session)))
}

func (h *SessionHandler) PrepareRepository(session *types.Session, link string) error {
	if link == "" {
		return fmt.Errorf("link is empty")
	}

	h.store.Session.ChangeMessage(session, "Cloning repository")
	if err := h.store.Session.CloneRepository(session, link); err != nil {
		return fmt.Errorf("wrong link or repository is private")
	}

	h.store.Session.ChangeMessage(session, "Collecting functions")
	if err := h.store.Session.GetFunctionsFromRepository(session); err != nil {
		return fmt.Errorf("error getting functions from repository")
	}

	h.store.Session.TouchDate(session)
	h.store.Session.ProcessStarter(session)

	return nil
}

func (h *SessionHandler) MessageReader(c *websocket.Conn, session *types.Session) {
	var recv map[string]string
	for {
		err := c.ReadJSON(&recv)
		if err != nil {
			break
		}

		if action, ok := recv["action"]; ok {
			switch action {
			case "start":
				if session.Status == types.WaitingForClient {
					if link, ok := recv["link"]; ok {
						if err = h.PrepareRepository(session, link); err != nil {
							h.store.Session.ChangeStatus(session, types.Error)
							h.store.Session.ChangeMessage(session, err.Error())
						}
					}
				}
			case "retry":
				if session.Status == types.Error {
					h.store.Session.ChangeStatus(session, types.WaitingForClient)
					h.store.Session.ChangeMessage(session, "")
					h.store.Session.ChangeDirectory(session, "")
					h.store.Session.TouchDate(session)
				}
			case "cancel":
				// @TODO: Change Repository record status to cancelled
				h.store.Session.ProcessStopper(session)
				h.store.Session.DeleteSession(session)
				c.Close()
			}
		}
		recv = map[string]string{}
		time.Sleep(websocketReadDelay * 10)
	}
}
