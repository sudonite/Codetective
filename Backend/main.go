package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/sudonite/Codetective/api"
	"github.com/sudonite/Codetective/db"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var config = fiber.Config{
	ErrorHandler: api.ErrorHandler,
}

func main() {
	mongoEndpoint := os.Getenv("MONGO_DB_URL")
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoEndpoint))
	if err != nil {
		log.Fatal(err)
	}

	var (
		userStore         = db.NewMongoUserStore(client)
		codeStore         = db.NewMongoCodeStore(client)
		fileStore         = db.NewMongoFileStore(client)
		repositoryStore   = db.NewMongoRepositoryStore(client)
		gitKeyStore       = db.NewMongoGitKeyStore(client)
		subscriptionStore = db.NewMongoSubscriptionStore(client)
		sessionStore      = db.NewMemorySessionStore(codeStore, fileStore, repositoryStore)
		store             = &db.Store{
			User:         userStore,
			Repository:   repositoryStore,
			File:         fileStore,
			Code:         codeStore,
			GitKey:       gitKeyStore,
			Subscription: subscriptionStore,
			Session:      sessionStore,
		}
		authHandler       = api.NewAuthHandler(userStore)
		userHandler       = api.NewUserHandler(store)
		codeHandler       = api.NewCodeHandler(store)
		fileHandler       = api.NewFileHandler(fileStore)
		repositoryHandler = api.NewRepositoryHandler(repositoryStore)
		keyHandler        = api.NewKeyHandler(store)
		sessionHandler    = api.NewSessionHandler(store)
	)

	app := fiber.New(config)
	app.Use(cors.New())

	go sessionStore.SessionDaemon()
	go sessionStore.SessionCleaner()

	app.Use("/ws", sessionHandler.HandleUpgradeConnection)
	app.Get("/ws", websocket.New(sessionHandler.HandleSession))

	apiv1Auth := app.Group("/api/v1/auth")

	apiv1Auth.Post("/login", authHandler.HandleAuthenticate)
	apiv1Auth.Post("/register", userHandler.HandlePostUser)

	apiv1 := app.Group("/api/v1", api.JWTAuthentication(userStore))

	apiv1.Get("/user", userHandler.HandleGetUser)
	apiv1.Put("/user", userHandler.HandlePutUser)
	apiv1.Delete("/user", userHandler.HandleDeleteUser)

	apiv1.Get("/repositories", repositoryHandler.HandleGetRepositories)
	apiv1.Delete("/repository/:id", repositoryHandler.HandleDeleteRepository)

	apiv1.Get("/files/:repoID", fileHandler.HandleGetFiles)

	apiv1.Get("/codes/:fileID", codeHandler.HandleGetCodes)
	apiv1.Put("/code/:codeID", codeHandler.HandlePutCode)

	apiv1.Get("/key/git/:keyID", keyHandler.HandleGetGitKey)
	apiv1.Put("/key/git/:keyID", keyHandler.HandlePutGitKey)
	apiv1.Post("/key/git", keyHandler.HandlePostGitKey)
	apiv1.Delete("/key/git/:keyID", keyHandler.HandleDeleteGitKey)

	listenAddr := os.Getenv("HTTP_LISTEN_ADDRESS")
	app.Listen(listenAddr)
}
