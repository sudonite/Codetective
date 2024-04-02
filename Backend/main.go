package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
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
		userStore       = db.NewMongoUserStore(client)
		codeStore       = db.NewMongoCodeStore(client)
		fileStore       = db.NewMongoFileStore(client)
		repositoryStore = db.NewMongoRepositoryStore(client)
		store           = &db.Store{
			User:       userStore,
			Repository: repositoryStore,
			File:       fileStore,
			Code:       codeStore,
		}
		authHandler       = api.NewAuthHandler(userStore)
		userHandler       = api.NewUserHandler(userStore)
		codeHandler       = api.NewCodeHandler(store)
		fileHandler       = api.NewFileHandler(fileStore)
		repositoryHandler = api.NewRepositoryHandler(repositoryStore)
	)

	app := fiber.New(config)
	app.Use(cors.New())

	apiv1Auth := app.Group("/api/v1/auth")

	apiv1Auth.Post("/login", authHandler.HandleAuthenticate)
	apiv1Auth.Post("/register", userHandler.HandlePostUser)

	apiv1 := app.Group("/api/v1", api.JWTAuthentication(userStore))

	apiv1.Get("/user/:id", userHandler.HandleGetUser)
	apiv1.Put("/user/:id", userHandler.HandlePutUser)
	apiv1.Delete("/user/:id", userHandler.HandleDeleteUser)

	apiv1.Get("/repositories", repositoryHandler.HandleGetRepositories)

	apiv1.Get("/files/:repoID", fileHandler.HandleGetFiles)

	apiv1.Get("/codes/:fileID", codeHandler.HandleGetCodes)
	apiv1.Put("/code/:codeID", codeHandler.HandlePutCode)

	listenAddr := os.Getenv("HTTP_LISTEN_ADDRESS")
	app.Listen(listenAddr)
}

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}
}
