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

func (h *RepositoryHandler) HandleDeleteRepository(c *fiber.Ctx) error {
	var (
		repositoryID = c.Params("id")
	)
	if err := h.repositoryStore.DeleteRepositoryByID(c.Context(), repositoryID); err != nil {
		return err
	}
	return c.JSON(map[string]string{"deleted": repositoryID})
}
