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
	repositories, err := h.repositoryStore.GetRepositories(c.Context())
	if err != nil {
		return err
	}
	return c.JSON(repositories)
}
