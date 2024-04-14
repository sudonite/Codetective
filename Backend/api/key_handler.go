package api

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/pem"
	"fmt"
	mrand "math/rand"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/types"
	"golang.org/x/crypto/ssh"
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
	pub, priv, _ := ed25519.GenerateKey(rand.Reader)
	pubKey, _ := ssh.NewPublicKey(pub)
	pemKey := &pem.Block{Type: "OPENSSH PRIVATE KEY", Bytes: MarshalED25519PrivateKey(priv)}

	privateKey := string(pem.EncodeToMemory(pemKey))
	publicKey := strings.TrimSpace(string(ssh.MarshalAuthorizedKey(pubKey)))

	params := types.UpdateGitKeyParams{
		PublicKey:  publicKey,
		PrivateKey: privateKey,
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

func MarshalED25519PrivateKey(key ed25519.PrivateKey) []byte {
	magic := append([]byte("openssh-key-v1"), 0)

	var w struct {
		CipherName   string
		KdfName      string
		KdfOpts      string
		NumKeys      uint32
		PubKey       []byte
		PrivKeyBlock []byte
	}

	pk1 := struct {
		Check1  uint32
		Check2  uint32
		Keytype string
		Pub     []byte
		Priv    []byte
		Comment string
		Pad     []byte `ssh:"rest"`
	}{}

	ci := mrand.Uint32()
	pk1.Check1 = ci
	pk1.Check2 = ci
	pk1.Keytype = ssh.KeyAlgoED25519

	pk, ok := key.Public().(ed25519.PublicKey)
	if !ok {
		return nil
	}

	pubKey := []byte(pk)
	pk1.Pub = pubKey
	pk1.Priv = []byte(key)
	pk1.Comment = ""
	bs := 8
	blockLen := len(ssh.Marshal(pk1))
	padLen := (bs - (blockLen % bs)) % bs
	pk1.Pad = make([]byte, padLen)

	for i := 0; i < padLen; i++ {
		pk1.Pad[i] = byte(i + 1)
	}

	prefix := []byte{0x0, 0x0, 0x0, 0x0b}
	prefix = append(prefix, []byte(ssh.KeyAlgoED25519)...)
	prefix = append(prefix, []byte{0x0, 0x0, 0x0, 0x20}...)

	w.CipherName = "none"
	w.KdfName = "none"
	w.KdfOpts = ""
	w.NumKeys = 1
	w.PubKey = append(prefix, pubKey...)
	w.PrivKeyBlock = ssh.Marshal(pk1)

	magic = append(magic, ssh.Marshal(w)...)

	return magic
}
