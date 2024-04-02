package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
)

type RepositoryHandler struct {
	repositoryStore db.RepositoryStore
}

func NewRepositoryHandler(reporitoryStore db.RepositoryStore) *RepositoryHandler {
	return &RepositoryHandler{
		repositoryStore: reporitoryStore,
	}
}

func (h *RepositoryHandler) HandleGetRepositories(c *fiber.Ctx) error {
	user, err := getAuthUser(c)
	if err != nil {
		return err
	}
	repositories, err := h.repositoryStore.GetRepositories(c.Context(), user.ID.Hex())
	if err != nil {
		return err
	}
	if repositories == nil {
		return c.JSON([]string{})
	}
	return c.JSON(repositories)
}
