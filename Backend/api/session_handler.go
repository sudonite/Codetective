package api

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/types"
	"github.com/valyala/fasthttp"
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
		sent    = false
	)
	defer c.Close()

	user, err := h.HandleAuthenticate(c)
	if err != nil {
		c.WriteJSON(err)
		return
	}

	session := h.store.Session.GetSession(user)

	go h.MessageReader(c, session, user)

	for running {
		switch session.Status {
		case types.Queue:
			h.UpdateQueue(session)
		case types.Finished:
			sent = false
		}

		msg = types.SessionMessage{
			Status:  session.Status,
			Message: session.Message,
		}

		if !sent && (session.Status == types.Scanning || session.Status == types.Finished) {
			repo, err := h.store.Repository.GetRepositoryByID(context.Background(), session.RepositoryID.Hex())
			if err == nil {
				msg.Repository = *repo
			}
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
	modelEndpoint := os.Getenv("MODEL_ENDPOINT_URL")
	if code, _, _ := fasthttp.Get(nil, modelEndpoint); code == 200 {
		h.store.Session.ChangeStatus(session, types.WaitingForClient)
	}
}

func (h *SessionHandler) UpdateQueue(session *types.Session) {
	h.store.Session.ChangeMessage(session, fmt.Sprintf("You are currently number %v in line", h.store.Session.GetPosition(session)))
}

func (h *SessionHandler) PrepareRepository(session *types.Session, user *types.User, msg *types.SessionAction) error {
	var err error

	if msg.Link == "" {
		return fmt.Errorf("link is empty")
	}

	key := &types.GitKey{}

	if msg.Private {
		key, err = h.store.GitKey.GetGitKeyByPlatform(context.Background(), user, msg.Platform)
		if err != nil {
			return fmt.Errorf("cannot find git key for this platform")
		}
	}

	h.store.Session.ChangeMessage(session, "Cloning repository")
	if err := h.store.Session.CloneRepository(session, user, key, msg.Link, msg.Private); err != nil {
		return fmt.Errorf("wrong link or repository is private")
	}

	h.store.Session.ChangeMessage(session, "Collecting functions")
	if err := h.store.Session.GetFunctionsFromRepository(session); err != nil {
		return fmt.Errorf("error getting functions from repository")
	}

	h.store.Session.ChangePlatform(session, msg.Platform)
	h.store.Session.TouchDate(session)
	h.store.Session.ProcessStarter(session)

	return nil
}

func (h *SessionHandler) MessageReader(c *websocket.Conn, session *types.Session, user *types.User) {
	defer c.Close()
	var msg *types.SessionAction
	running := true

	for running {
		err := c.ReadJSON(&msg)
		if err != nil {
			break
		}

		switch msg.Action {
		case "start":
			if session.Status == types.WaitingForClient {
				h.store.Session.ChangeStatus(session, types.Scanning)
				if err := h.PrepareRepository(session, user, msg); err != nil {
					h.store.Session.ChangeStatus(session, types.Error)
					h.store.Session.ChangeMessage(session, err.Error())
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
			h.store.Session.ProcessStopper(session)
			h.store.Session.DeleteSession(session)
			running = false
		}

		msg = &types.SessionAction{}
		time.Sleep(websocketReadDelay)
	}
}
