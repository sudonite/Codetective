package api

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/types"
)

type CodeHandler struct {
	store *db.Store
}

func NewCodeHandler(store *db.Store) *CodeHandler {
	return &CodeHandler{
		store: store,
	}
}

func (h *CodeHandler) HandleGetCodes(c *fiber.Ctx) error {
	var (
		fileID = c.Params("fileID")
	)
	code, err := h.store.Code.GetCodesByFileID(c.Context(), fileID)
	if err != nil {
		return err
	}
	for _, c := range code {
		c.Code = strings.ReplaceAll(c.Code, "\\n", "\n")
		c.Code = strings.ReplaceAll(c.Code, "\\t", "\t")
	}
	return c.JSON(code)
}

func (h *CodeHandler) HandlePutCode(c *fiber.Ctx) error {
	/*
	* @TODO
	* Refactor this part of code
	 */
	var (
		params types.UpdateCodeParams
		codeID = c.Params("codeID")
	)
	if err := c.BodyParser(&params); err != nil {
		return ErrBadRequest()
	}
	filter := db.Map{"_id": codeID}
	if err := h.store.Code.UpdateCode(c.Context(), filter, params); err != nil {
		return err
	}
	code, err := h.store.Code.GetCodeByID(c.Context(), codeID)
	if err != nil {
		return err
	}
	codes, err := h.store.Code.GetCodesByFileID(c.Context(), code.FileID.Hex())
	if err != nil {
		return err
	}
	file, err := h.store.File.GetFileByID(c.Context(), code.FileID.Hex())
	if err != nil {
		return err
	}

	var fileStatus = file.Status
	fileVulnerable := types.FileIsVulnerable(codes)
	fileFalsePositive := types.FileIsFalsePositive(codes)

	if fileVulnerable {
		fileStatus = types.Vulnerable
	} else if fileFalsePositive {
		fileStatus = types.FalsePositive
	} else {
		fileStatus = types.Fixed
	}
	if fileStatus != file.Status {
		fileParams := types.UpdateFileParams{
			Status: fileStatus,
		}
		fileFilter := db.Map{"_id": file.ID.Hex()}
		if err := h.store.File.UpdateFile(c.Context(), fileFilter, fileParams); err != nil {
			return err
		}
	}

	files, err := h.store.File.GetFilesByRepositoryID(c.Context(), file.RepositoryID.Hex())
	if err != nil {
		return err
	}
	repo, err := h.store.Repository.GetRepositoryByID(c.Context(), file.RepositoryID.Hex())
	if err != nil {
		return err
	}

	var repoStatus = repo.Status
	repoVulnerable := types.RepositoryIsVulnerable(files)
	repoFalsePositive := types.RepositoryIsFalsePositive(files)

	if repoVulnerable {
		repoStatus = types.Vulnerable
	} else if repoFalsePositive {
		repoStatus = types.FalsePositive
	} else {
		repoStatus = types.Fixed
	}
	if repoStatus != repo.Status {
		repoParams := types.UpdateRepositoryParams{
			Status: repoStatus,
		}
		repoFilter := db.Map{"_id": repo.ID.Hex()}
		if err := h.store.Repository.UpdateRepository(c.Context(), repoFilter, repoParams); err != nil {
			return err
		}
	}

	return c.JSON(map[string]string{"updated": codeID})
}
