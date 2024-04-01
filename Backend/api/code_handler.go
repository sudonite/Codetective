package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/types"
)

type CodeHandler struct {
	codeStore db.CodeStore
}

func NewCodeHandler(codeStore db.CodeStore) *CodeHandler {
	return &CodeHandler{
		codeStore: codeStore,
	}
}

func (h *CodeHandler) HandleGetCodes(c *fiber.Ctx) error {
	var (
		fileID = c.Params("fileID")
	)
	code, err := h.codeStore.GetCodesByFileID(c.Context(), fileID)
	if err != nil {
		return err
	}
	return c.JSON(code)
}

func (h *CodeHandler) HandlePutCode(c *fiber.Ctx) error {
	/*
	* @TODO
	* Need to change file and repository status
	 */
	var (
		params types.UpdateCodeParams
		codeID = c.Params("codeID")
	)
	if err := c.BodyParser(&params); err != nil {
		return ErrBadRequest()
	}
	filter := db.Map{"_id": codeID}
	if err := h.codeStore.UpdateCode(c.Context(), filter, params); err != nil {
		return err
	}
	return c.JSON(map[string]string{"updated": codeID})
}
