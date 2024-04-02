package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/types"
)

type KeyHandler struct {
	store *db.Store
}

func NewKeyHandler(store *db.Store) *KeyHandler {
	return &KeyHandler{
		store: store,
	}
}

func (h *KeyHandler) HandleGetGitKey(c *fiber.Ctx) error {
	var (
		keyID = c.Params("keyID")
	)
	key, err := h.store.GitKey.GetGitKeyByID(c.Context(), keyID)
	if err != nil {
		return err
	}
	return c.JSON(key)
}

func (h *KeyHandler) HandlePutGitKey(c *fiber.Ctx) error {
	var (
		params types.UpdateGitKeyParams
		keyID  = c.Params("keyID")
	)
	if err := c.BodyParser(&params); err != nil {
		return ErrBadRequest()
	}
	filter := db.Map{"_id": keyID}
	if err := h.store.GitKey.UpdateGitKey(c.Context(), filter, params); err != nil {
		return err
	}
	return c.JSON(map[string]string{"updated": keyID})
}

func (h *KeyHandler) HandlePostGitKey(c *fiber.Ctx) error {
	var (
		params types.CreateGitKeyParams
	)
	if err := c.BodyParser(&params); err != nil {
		return ErrBadRequest()
	}
	key, err := h.store.GitKey.InsertGitKey(c.Context(), params)
	if err != nil {
		return err
	}
	return c.JSON(key)
}

func (h *KeyHandler) HandleGetAPIKey(c *fiber.Ctx) error {
	var (
		keyID = c.Params("keyID")
	)
	key, err := h.store.APIKey.GetAPIKeyByID(c.Context(), keyID)
	if err != nil {
		return err
	}
	return c.JSON(key)
}

func (h *KeyHandler) HandlePutAPIKey(c *fiber.Ctx) error {
	var (
		params types.UpdateAPIKeyParams
		keyID  = c.Params("keyID")
	)
	if err := c.BodyParser(&params); err != nil {
		return ErrBadRequest()
	}
	filter := db.Map{"_id": keyID}
	if err := h.store.APIKey.UpdateAPIKey(c.Context(), filter, params); err != nil {
		return err
	}
	return c.JSON(map[string]string{"updated": keyID})
}

func (h *KeyHandler) HandlePostAPIKey(c *fiber.Ctx) error {
	var (
		params types.CreateAPIKeyParams
	)
	if err := c.BodyParser(&params); err != nil {
		return ErrBadRequest()
	}
	key, err := h.store.APIKey.InsertAPIKey(c.Context(), params)
	if err != nil {
		return err
	}
	return c.JSON(key)
}
