package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/db/fixtures"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}
	var (
		ctx           = context.Background()
		mongoEndpoint = os.Getenv("MONGO_DB_URL")
		mongoDBName   = os.Getenv("MONGO_DB_NAME")
	)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoEndpoint))
	if err != nil {
		log.Fatal(err)
	}
	if err := client.Database(mongoDBName).Drop(ctx); err != nil {
		log.Fatal(err)
	}
	store := &db.Store{
		User: db.NewMongoUserStore(client),
	}

	user := fixtures.AddUser(store, "user", "foo", false)
	fmt.Printf("user -> %s_%s", user.FirstName, user.LastName)
	admin := fixtures.AddUser(store, "admin", "admin", true)
	fmt.Printf("admin -> %s_%s", admin.FirstName, admin.LastName)
}
