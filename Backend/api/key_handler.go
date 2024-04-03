package api

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"time"

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
		keyID = c.Params("keyID")
	)
	publicKey, privateKey, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		return err
	}
	privateKeyBase64 := fmt.Sprintf(`-----BEGIN OPENSSH PRIVATE KEY-----\n%v\n-----END OPENSSH PRIVATE KEY-----`, base64.StdEncoding.EncodeToString(privateKey))
	publicKeyBase64 := fmt.Sprintf("ssh-ed25519 %v", base64.StdEncoding.EncodeToString(publicKey))

	params := types.UpdateGitKeyParams{
		PublicKey:  publicKeyBase64,
		PrivateKey: privateKeyBase64,
		Date:       time.Now(),
	}
	filter := db.Map{"_id": keyID}
	if err := h.store.GitKey.UpdateGitKey(c.Context(), filter, params); err != nil {
		return err
	}
	key, err := h.store.GitKey.GetGitKeyByID(c.Context(), keyID)
	if err != nil {
		return err
	}
	return c.JSON(key)
}

func (h *KeyHandler) HandleDeleteGitKey(c *fiber.Ctx) error {
	var (
		keyID = c.Params("keyID")
	)
	if err := h.store.GitKey.DeleteGitKey(c.Context(), keyID); err != nil {
		return err
	}
	return c.JSON(map[string]string{"deleted": keyID})
}

func (h *KeyHandler) HandlePostGitKey(c *fiber.Ctx) error {
	var (
		params types.CreateGitKeyParams
	)
	if err := c.BodyParser(&params); err != nil {
		return ErrBadRequest()
	}
	newKey, err := types.NewGitKeyFromParams(params)
	if err != nil {
		return err
	}
	key, err := h.store.GitKey.InsertGitKey(c.Context(), newKey)
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
		fmt.Printf("%+v", params)
		return ErrBadRequest()
	}
	params.Date = time.Now()
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
	newKey, err := types.NewAPIKeyFromParams(params)
	if err != nil {
		return err
	}
	key, err := h.store.APIKey.InsertAPIKey(c.Context(), newKey)
	if err != nil {
		return err
	}
	return c.JSON(key)
}

func (h *KeyHandler) HandleDeleteAPIKey(c *fiber.Ctx) error {
	var (
		keyID = c.Params("keyID")
	)
	if err := h.store.APIKey.DeleteAPIKey(c.Context(), keyID); err != nil {
		return err
	}
	return c.JSON(map[string]string{"deleted": keyID})
}
