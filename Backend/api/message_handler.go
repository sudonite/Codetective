package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
)

type MessageHandler struct {
	messageStore db.MessageStore
}

func NewMessageHandler(messageStore db.MessageStore) *MessageHandler {
	return &MessageHandler{
		messageStore: messageStore,
	}
}

func (h *MessageHandler) HandleGetMessages(c *fiber.Ctx) error {
	var (
		fileID = c.Params("fileID")
	)
	messages, err := h.messageStore.GetMessageByCodeID(c.Context(), fileID)
	if err != nil {
		return err
	}
	return c.JSON(messages)
}
