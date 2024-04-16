package api

import (
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	subscription, err := h.store.Subscription.GetSubscriptionByUserID(c.Context(), user.ID.Hex())
	if err != nil {
		return err
	}
	gitKeys, err := h.store.GitKey.GetGitKeysByUserID(c.Context(), user.ID.Hex())
	if err != nil {
		return err
	}
	result := map[string]interface{}{
		"user":         user,
		"subscription": subscription,
		"gitKeys":      gitKeys,
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
	if err := h.store.GitKey.InsertEmptyGitKeys(c.Context(), insertedUser.ID); err != nil {
		return err
	}
	oid, err := primitive.ObjectIDFromHex(insertedUser.ID.Hex())
	if err != nil {
		return err
	}
	subscription, err := types.NewSubscriptionFromParams(types.CreateSubscriptionParams{
		UserID:  oid,
		Plan:    types.Free,
		EndDate: time.Date(2050, 1, 1, 0, 0, 0, 0, time.UTC),
	})
	if err != nil {
		return err
	}
	if _, err := h.store.Subscription.InsertSubscription(c.Context(), subscription); err != nil {
		return err
	}
	return c.JSON(insertedUser)
}
