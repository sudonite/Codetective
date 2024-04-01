package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
)

type FileHandler struct {
	fileStore db.FileStore
}

func NewFileHandler(fileStore db.FileStore) *FileHandler {
	return &FileHandler{
		fileStore: fileStore,
	}
}

func (h *FileHandler) HandleGetFiles(c *fiber.Ctx) error {
	var (
		repoID = c.Params("repoID")
	)
	files, err := h.fileStore.GetFilesByRepositoryID(c.Context(), repoID)
	if err != nil {
		return err
	}
	return c.JSON(files)
}
