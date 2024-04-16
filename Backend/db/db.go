package db

const MongoDBNameEnvName = "MONGO_DB_NAME"

type Map map[string]any

type Store struct {
	User         UserStore
	Repository   RepositoryStore
	Message      MessageStore
	File         FileStore
	Code         CodeStore
	GitKey       GitKeyStore
	Subscription SubscriptionStore
	Session      SessionStore
}
