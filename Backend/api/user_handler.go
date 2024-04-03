package api

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserHandler struct {
	store *db.Store
}

func NewUserHandler(store *db.Store) *UserHandler {
	return &UserHandler{
		store: store,
	}
}

func (h *UserHandler) HandleGetUser(c *fiber.Ctx) error {
	user, err := getAuthUser(c)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.JSON(map[string]string{"error": "not found"})
		}
		return err
	}
	gitKeys, err := h.store.GitKey.GetGitKeysByUserID(c.Context(), user.ID.Hex())
	if err != nil {
		return err
	}
	apiKeys, err := h.store.APIKey.GetAPIKeysByUserID(c.Context(), user.ID.Hex())
	if err != nil {
		return err
	}
	result := map[string]interface{}{
		"user":    user,
		"gitKeys": gitKeys,
		"apiKeys": apiKeys,
	}
	return c.JSON(result)
}

func (h *UserHandler) HandlePutUser(c *fiber.Ctx) error {
	var (
		params types.UpdateUserParams
	)
	user, err := getAuthUser(c)
	if err != nil {
		return err
	}
	if err := c.BodyParser(&params); err != nil {
		return ErrBadRequest()
	}
	filter := db.Map{"_id": user.ID.Hex()}
	if err := h.store.User.UpdateUser(c.Context(), filter, params); err != nil {
		return err
	}
	return c.JSON(map[string]string{"updated": user.ID.Hex()})
}

func (h *UserHandler) HandleDeleteUser(c *fiber.Ctx) error {
	user, err := getAuthUser(c)
	if err != nil {
		return err
	}
	if err := h.store.User.DeleteUser(c.Context(), user.ID.Hex()); err != nil {
		return err
	}
	return c.JSON(map[string]string{"deleted": user.ID.Hex()})
}

func (h *UserHandler) HandlePostUser(c *fiber.Ctx) error {
	var (
		params types.CreateUserParams
	)
	if err := c.BodyParser(&params); err != nil {
		return ErrBadRequest()
	}
	if errors := params.Validate(); len(errors) > 0 {
		return c.JSON(errors)
	}
	user, err := types.NewUserFromParams(params)
	if err != nil {
		return err
	}
	insertedUser, err := h.store.User.InsertUser(c.Context(), user)
	if err != nil {
		return err
	}
	if err := h.store.APIKey.InsertEmptyAPIKeys(c.Context(), insertedUser.ID); err != nil {
		return err
	}
	if err := h.store.GitKey.InsertEmptyGitKeys(c.Context(), insertedUser.ID); err != nil {
		return err
	}
	return c.JSON(insertedUser)
}
