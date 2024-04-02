package db

const MongoDBNameEnvName = "MONGO_DB_NAME"

type Store struct {
	User       UserStore
	Repository RepositoryStore
	Message    MessageStore
	File       FileStore
	Code       CodeStore
	GitKey     GitKeyStore
	APIKey     APIKeyStore
}
