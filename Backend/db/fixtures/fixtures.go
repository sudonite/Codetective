package fixtures

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddUser(store *db.Store, fn, ln, uname, passwd string, admin bool) *types.User {
	user, err := types.NewUserFromParams(types.CreateUserParams{
		Email:     fmt.Sprintf("%s@example.com", uname),
		FirstName: fn,
		LastName:  ln,
		Password:  passwd,
	})
	if err != nil {
		log.Fatal(err)
	}
	user.IsAdmin = admin
	insertedUser, err := store.User.InsertUser(context.TODO(), user)
	if err != nil {
		log.Fatal(err)
	}
	return insertedUser
}

func AddRepository(store *db.Store, userID primitive.ObjectID, name, url string, status types.StatusType, platform types.GitPlatformType, date time.Time) *types.Repository {
	repo, err := types.NewRepositoryFromParams(types.CreateRepositoryParams{
		UserID:   userID,
		Name:     name,
		URL:      url,
		Status:   status,
		Platform: platform,
		Date:     date,
	})
	if err != nil {
		log.Fatal(err)

	}
	insertedRepo, err := store.Repository.InsertRepository(context.TODO(), repo)
	if err != nil {
		log.Fatal(err)
	}
	return insertedRepo
}

func AddFile(store *db.Store, repoID primitive.ObjectID, name, path, ext string, status types.StatusType, date time.Time) *types.File {
	file, err := types.NewFileFromParams(types.CreateFileParams{
		RepositoryID: repoID,
		Name:         name,
		Path:         path,
		Extension:    ext,
		Status:       status,
		Date:         date,
	})
	if err != nil {
		log.Fatal(err)
	}
	insertedFile, err := store.File.InsertFile(context.TODO(), file)
	if err != nil {
		log.Fatal(err)
	}
	return insertedFile
}

func AddCode(store *db.Store, fileID primitive.ObjectID, status types.StatusType, lineStart int, code string, date time.Time) *types.Code {
	newCode, err := types.NewCodeFromParams(types.CreateCodeParams{
		FileID:    fileID,
		Status:    status,
		LineStart: lineStart,
		Code:      code,
		Date:      date,
	})
	if err != nil {
		log.Fatal(err)
	}
	insertedCode, err := store.Code.InsertCode(context.TODO(), newCode)
	if err != nil {
		log.Fatal(err)
	}
	return insertedCode
}
