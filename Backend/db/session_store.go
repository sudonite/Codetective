package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"sync"
	"time"

	"github.com/go-git/go-git/v5"
	"github.com/google/uuid"
	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/cpp"
	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	fakeDelay      = time.Millisecond * 3
	maxSessions    = 2
	maxSessionIdle = time.Minute * 5
	cleanerDelay   = time.Minute * 1
	clonePath      = "sessions"
	extensions     = []string{".h", ".c", ".cc", ".cpp"}
)

type SessionStore interface {
	SessionDaemon()                                                      //
	SessionCleaner()                                                     // @TODO
	SessionRunner(session *types.Session)                                // @TODO
	SessionFinisher(session *types.Session)                              //
	ProcessStarter(session *types.Session)                               //
	ProcessStopper(session *types.Session)                               //
	HandleQueue()                                                        //
	GetSession(user *types.User) *types.Session                          //
	GetPosition(session *types.Session) int                              //
	AddSession(user *types.User) *types.Session                          //
	AddFile(session *types.Session, file *types.FileFuncType)            //
	DeleteSession(session *types.Session)                                //
	TouchDate(session *types.Session)                                    //
	ChangeStatus(session *types.Session, status types.SessionStatusType) //
	ChangeMessage(session *types.Session, message string)                //
	ChangeDirectory(session *types.Session, dir string)                  //
	CloneRepository(session *types.Session, link string) error           // @TODO
	GetFunctionsFromRepository(session *types.Session) error             //
	GetCodeFromFile(file []byte, pos *types.FuncPostType) string         // @TODO
	CountFunctions(session *types.Session) int                           //
}

type WebsocketSessionStore struct {
	sessions types.Sessions
	sc       chan *types.Session
	fc       chan *types.Session
	mu       *sync.Mutex
}

func NewWebsocketSessionStore(sessions types.Sessions, sc chan *types.Session, fc chan *types.Session, mu *sync.Mutex) *WebsocketSessionStore {
	return &WebsocketSessionStore{sessions, sc, fc, mu}
}

func (s *WebsocketSessionStore) SessionDaemon() {
	for {
		select {
		case session := <-s.sc:
			go s.SessionRunner(session)
		case session := <-s.fc:
			s.SessionFinisher(session)
		}
	}
}

func (s *WebsocketSessionStore) SessionCleaner() {
	for {
		time.Sleep(cleanerDelay)
		for _, v := range s.sessions {
			if time.Since(v.Modified) > maxSessionIdle && v.Status != types.Queue && v.Status != types.Scanning {
				s.DeleteSession(v)
			}
		}
		// @TODO: Remove unused folders also here
		// And check other places where the session is deleted at the correct way
	}
}

func (s *WebsocketSessionStore) SessionRunner(session *types.Session) {
	// @TODO: Create Repository instance and save it to the database
	s.ChangeStatus(session, types.Scanning)
	availableFunctions := s.CountFunctions(session)
	actual := 1

	for _, file := range session.Files {
		for _, function := range file.FuncPos {
			content, err := os.ReadFile(session.Directory + file.Path)
			if err != nil {
				log.Println(err)
			}
			s.ChangeMessage(session, fmt.Sprintf("Analyzing function %d of %d", actual, availableFunctions))
			code := s.GetCodeFromFile(content, &function)
			_ = code
			// @TODO: Send code to the model here in a new function
			// And also create IF a code is exists the File (if not exists) and the Code
			actual++
			time.Sleep(fakeDelay)
		}
	}

	s.ProcessStopper(session)
}

func (s *WebsocketSessionStore) SessionFinisher(session *types.Session) {
	s.ChangeStatus(session, types.Finished)
	s.ChangeMessage(session, "")
	s.TouchDate(session)
	s.DeleteSession(session)
	s.HandleQueue()
}

func (s *WebsocketSessionStore) ProcessStarter(session *types.Session) {
	s.mu.Lock()
	s.sc <- session
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ProcessStopper(session *types.Session) {
	s.mu.Lock()
	s.fc <- session
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) HandleQueue() {
	scanning := 0
	for _, v := range s.sessions {
		if v.Status != types.Queue {
			scanning++
		}
	}
	for i := 0; i < maxSessions-scanning; i++ {
		var key primitive.ObjectID
		for k, v := range s.sessions {
			if v.Status == types.Queue && (key == primitive.NilObjectID || v.Modified.Before(s.sessions[key].Modified)) {
				key = k
			}
		}
		if key != primitive.NilObjectID {
			session := s.sessions[key]
			s.ChangeStatus(session, types.Connecting)
			s.ChangeMessage(session, "")
			s.TouchDate(session)
		}
	}
}

func (s *WebsocketSessionStore) GetSession(user *types.User) *types.Session {
	if session, ok := s.sessions[user.ID]; ok {
		return session
	}
	return s.AddSession(user)
}

func (s *WebsocketSessionStore) GetPosition(session *types.Session) int {
	var (
		position = 1
	)
	for _, v := range s.sessions {
		if v.Status == types.Queue && v.Modified.Before(session.Modified) {
			position++
		}
	}
	return position
}

func (s *WebsocketSessionStore) AddSession(user *types.User) *types.Session {
	defer s.mu.Unlock()
	s.mu.Lock()
	newSession := &types.Session{
		RepositoryID: primitive.NewObjectID(),
		Directory:    "",
		Status:       types.Queue,
		Message:      "",
		Modified:     time.Now(),
	}
	if len(s.sessions) < maxSessions {
		newSession.Status = types.Connecting
	}
	s.sessions[user.ID] = newSession
	return newSession
}

func (s *WebsocketSessionStore) AddFile(session *types.Session, file *types.FileFuncType) {
	s.mu.Lock()
	session.Files = append(session.Files, *file)
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) DeleteSession(session *types.Session) {
	for k, v := range s.sessions {
		if v == session {
			s.mu.Lock()
			delete(s.sessions, k)
			s.mu.Unlock()
			break
		}

	}
}

func (s *WebsocketSessionStore) TouchDate(session *types.Session) {
	s.mu.Lock()
	session.Modified = time.Now()
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ChangeStatus(session *types.Session, status types.SessionStatusType) {
	s.mu.Lock()
	session.Status = status
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ChangeMessage(session *types.Session, message string) {
	s.mu.Lock()
	session.Message = message
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ChangeDirectory(session *types.Session, dir string) {
	s.mu.Lock()
	session.Directory = dir
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) CloneRepository(session *types.Session, link string) error {
	// @TODO: Add private repository feature
	path := clonePath + "/" + strings.ReplaceAll(uuid.New().String(), "-", "")
	_, err := git.PlainClone(path, false, &git.CloneOptions{
		URL:      link,
		Progress: nil,
	})
	if err != nil {
		return err
	}

	s.ChangeDirectory(session, path)

	return nil
}

func (s *WebsocketSessionStore) GetFunctionsFromRepository(session *types.Session) error {
	files := []string{}
	err := filepath.Walk(session.Directory, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.Mode().IsRegular() {
			return nil
		}
		ext := filepath.Ext(path)
		if slices.Contains(extensions, ext) {
			files = append(files, strings.TrimPrefix(path, session.Directory))
		}
		return nil
	})
	if err != nil {
		return err
	}

	parser := sitter.NewParser()
	parser.SetLanguage(cpp.GetLanguage())

	var funcBytes []types.FuncPostType
	var getPos func(*sitter.Node, *[]types.FuncPostType)

	getPos = func(node *sitter.Node, pos *[]types.FuncPostType) {
		if node.Type() == "function_definition" {
			*pos = append(*pos, types.FuncPostType{
				StartByte: uint32(node.StartByte()),
				EndByte:   uint32(node.EndByte()),
			})
		}
		for i := 0; i < int(node.ChildCount()); i++ {
			getPos(node.Child(i), pos)
		}
	}

	for _, file := range files {
		funcBytes = []types.FuncPostType{}
		content, err := os.ReadFile(session.Directory + file)
		if err != nil {
			return err
		}

		tree, err := parser.ParseCtx(context.Background(), nil, content)
		if err != nil {
			return err
		}

		getPos(tree.RootNode(), &funcBytes)
		s.AddFile(session, &types.FileFuncType{
			Path:    strings.TrimPrefix(file, session.Directory),
			FuncPos: funcBytes,
		})
	}
	return nil
}

func (s *WebsocketSessionStore) GetCodeFromFile(file []byte, pos *types.FuncPostType) string {
	// @TODO: Refactor this function to return the code and the line number
	code := string(file[pos.StartByte:pos.EndByte])
	code = strings.ReplaceAll(code, "\n", "\\n")
	code = strings.ReplaceAll(code, "\t", "\\t")
	return code
}

func (s *WebsocketSessionStore) CountFunctions(session *types.Session) int {
	sum := 0
	for _, v := range session.Files {
		sum += len(v.FuncPos)
	}
	return sum
}
