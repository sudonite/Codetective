package db

import (
	"context"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
	"sync"
	"time"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing/transport/ssh"
	"github.com/google/uuid"
	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/cpp"
	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
	sshcrypto "golang.org/x/crypto/ssh"
)

var (
	fakeDelay      = time.Millisecond * 5
	maxSessions    = 2
	maxSessionIdle = time.Minute * 5
	cleanerDelay   = time.Minute * 1
	clonePath      = "sessions"
	extensions     = []string{".c", ".cc", ".cpp"}
)

type SessionStore interface {
	SessionDaemon()
	SessionCleaner()
	SessionRunner(*types.Session)
	SessionFinisher(*types.Session)
	ProcessStarter(*types.Session)
	ProcessStopper(*types.Session)
	HandleQueue()
	HandleModel(string) bool
	GetSession(*types.User) *types.Session
	GetPosition(*types.Session) int
	AddSession(*types.User) *types.Session
	AddFile(*types.Session, *types.FileFuncType)
	DeleteSession(*types.Session)
	TouchDate(*types.Session)
	ChangeStatus(*types.Session, types.SessionStatusType)
	ChangeMessage(*types.Session, string)
	ChangeName(*types.Session, string)
	ChangePlatform(*types.Session, types.GitPlatformType)
	ChangeDirectory(*types.Session, string)
	ChangeURL(*types.Session, string)
	CloneRepository(*types.Session, *types.User, *types.GitKey, string, bool) error
	GetFunctionsFromRepository(*types.Session) error
	GetCodeFromFile([]byte, *types.FuncPostType) (string, int)
	CountFunctions(*types.Session) int
}

type WebsocketSessionStore struct {
	sessions  *types.Sessions
	codeStore *MongoCodeStore
	fileStore *MongoFileStore
	repoStore *MongoRepositoryStore
	sc        chan *types.Session
	fc        chan *types.Session
	mu        *sync.Mutex
}

func NewWebsocketSessionStore(sessions *types.Sessions, cs *MongoCodeStore, fs *MongoFileStore, rs *MongoRepositoryStore, sc chan *types.Session, fc chan *types.Session, mu *sync.Mutex) *WebsocketSessionStore {
	return &WebsocketSessionStore{sessions, cs, fs, rs, sc, fc, mu}
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
		scanDir := []string{}

		dir, _ := os.Open(clonePath)
		fileInfos, _ := dir.Readdir(-1)
		dir.Close()

		for _, v := range *s.sessions {
			if time.Since(v.Modified) > maxSessionIdle && v.Status != types.Queue && v.Status != types.Scanning {
				fmt.Printf("Deleting session: %#v\n", v)
				s.DeleteSession(v)
			} else {
				scanDir = append(scanDir, v.Directory)
			}
		}

		fmt.Printf("Scan dir: %#v\n", scanDir)

		for _, fileInfo := range fileInfos {
			fmt.Printf("File info: %#v\n", fileInfo.Name())
			if fileInfo.IsDir() && !slices.Contains(scanDir, fileInfo.Name()) {
				fmt.Println("Deleting folder: ", fileInfo.Name())
				os.RemoveAll(filepath.Join(clonePath, fileInfo.Name()))
			}
		}
	}
}

func (s *WebsocketSessionStore) SessionRunner(session *types.Session) {
	var userID primitive.ObjectID
	for k, v := range *s.sessions {
		if v == session {
			userID = k
			break
		}
	}

	repository, _ := s.repoStore.InsertRepository(context.Background(), &types.Repository{
		UserID:   userID,
		Name:     session.Name,
		URL:      session.URL,
		Status:   types.Running,
		Platform: types.GitPlatformType(session.Platform),
		Date:     time.Now(),
	})

	s.ChangeRepositoryID(session, repository.ID)

	actual := 1
	vulnRepo := false
	availableFunctions := s.CountFunctions(session)

	for _, file := range session.Files {
		for _, function := range file.FuncPos {
			content, err := os.ReadFile(filepath.Join(clonePath, session.Directory, file.Path))
			if err != nil {
				continue
			}

			s.ChangeMessage(session, fmt.Sprintf("Analyzing function %d of %d", actual, availableFunctions))
			code, lineStart := s.GetCodeFromFile(content, &function)

			vuln := s.HandleModel(code)

			if vuln {
				vulnRepo = true
				path := filepath.Dir(file.Path)[1:]
				ext := filepath.Ext(file.Path)
				name := strings.TrimSuffix(filepath.Base(file.Path), ext)

				savedFile, err := s.fileStore.GetFileByParams(context.Background(), repository.ID.Hex(), path, name, ext)
				if err != nil {
					savedFile, _ = s.fileStore.InsertFile(context.Background(), &types.File{
						RepositoryID: repository.ID,
						Path:         path,
						Name:         name,
						Extension:    ext,
						Status:       types.Vulnerable,
						Date:         time.Now(),
					})
				}

				s.codeStore.InsertCode(context.Background(), &types.Code{
					FileID:    savedFile.ID,
					Status:    types.Vulnerable,
					LineStart: lineStart,
					Code:      code,
					Date:      time.Now(),
				})
			}

			actual++
			time.Sleep(fakeDelay)
		}
	}

	var repoParams types.UpdateRepositoryParams
	repoFilter := Map{"_id": repository.ID.Hex()}

	if vulnRepo {
		repoParams = types.UpdateRepositoryParams{Status: types.Vulnerable}
	} else {
		repoParams = types.UpdateRepositoryParams{Status: types.Clean}
	}

	s.repoStore.UpdateRepository(context.Background(), repoFilter, repoParams)
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
	for _, v := range *s.sessions {
		if v.Status != types.Queue {
			scanning++
		}
	}
	for i := 0; i < maxSessions-scanning; i++ {
		var key primitive.ObjectID
		for k, v := range *s.sessions {
			if v.Status == types.Queue && (key == primitive.NilObjectID || v.Modified.Before((*s.sessions)[key].Modified)) {
				key = k
			}
		}
		if key != primitive.NilObjectID {
			session := (*s.sessions)[key]
			s.ChangeStatus(session, types.Connecting)
			s.ChangeMessage(session, "")
			s.TouchDate(session)
		}
	}
}

func (s *WebsocketSessionStore) HandleModel(code string) bool {
	return rand.New(rand.NewSource(time.Now().UnixNano())).Intn(100) <= 2
}

func (s *WebsocketSessionStore) GetSession(user *types.User) *types.Session {
	if session, ok := (*s.sessions)[user.ID]; ok {
		return session
	}
	return s.AddSession(user)
}

func (s *WebsocketSessionStore) GetPosition(session *types.Session) int {
	var (
		position = 1
	)
	for _, v := range *s.sessions {
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
		Directory: "",
		Status:    types.Queue,
		Message:   "",
		Modified:  time.Now(),
	}
	if len(*s.sessions) < maxSessions {
		newSession.Status = types.Connecting
	}
	(*s.sessions)[user.ID] = newSession
	return newSession
}

func (s *WebsocketSessionStore) AddFile(session *types.Session, file *types.FileFuncType) {
	s.mu.Lock()
	session.Files = append(session.Files, *file)
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) DeleteSession(session *types.Session) {
	os.RemoveAll(filepath.Join(clonePath, session.Directory))
	for k, v := range *s.sessions {
		if v == session {
			s.mu.Lock()
			delete(*s.sessions, k)
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

func (s *WebsocketSessionStore) ChangeName(session *types.Session, name string) {
	s.mu.Lock()
	session.Name = name
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ChangePlatform(session *types.Session, platform types.GitPlatformType) {
	s.mu.Lock()
	session.Platform = platform
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ChangeDirectory(session *types.Session, dir string) {
	s.mu.Lock()
	session.Directory = dir
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ChangeRepositoryID(session *types.Session, id primitive.ObjectID) {
	s.mu.Lock()
	session.RepositoryID = id
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) ChangeURL(session *types.Session, url string) {
	s.mu.Lock()
	session.URL = url
	s.mu.Unlock()
}

func (s *WebsocketSessionStore) CloneRepository(session *types.Session, user *types.User, key *types.GitKey, link string, priv bool) error {
	var (
		repoName = "Unknown"
	)

	re := regexp.MustCompile(`(?:\/|:)([^\/:]+)\/([^\/:]+?)(?:\.git)?$`)
	match := re.FindStringSubmatch(link)
	if len(match) >= 3 {
		repoName = strings.ToUpper(string(match[2][0])) + match[2][1:]
	}

	re = regexp.MustCompile(`^git@(.*?):(.*?)(?:\.git)?$`)
	match = re.FindStringSubmatch(link)
	if len(match) >= 3 && !priv {
		hostingPlatform := match[1]
		repoPath := match[2]
		link = fmt.Sprintf("https://%s/%s", hostingPlatform, repoPath)
	}

	path := strings.ReplaceAll(uuid.New().String(), "-", "")
	s.ChangeDirectory(session, path)

	config := &git.CloneOptions{
		URL:      link,
		Progress: nil,
	}

	if priv {
		sshKey := []byte(key.PrivateKey)
		publicKey, err := ssh.NewPublicKeys("git", sshKey, "")
		if err != nil {
			return err
		}
		publicKey.HostKeyCallback = sshcrypto.InsecureIgnoreHostKey()
		config.Auth = publicKey
	}

	_, err := git.PlainClone(filepath.Join(clonePath, path), false, config)
	if err != nil {
		fmt.Println("Clone error:", err)
		return err
	}

	s.ChangeName(session, repoName)
	s.ChangePlatform(session, session.Platform)
	s.ChangeURL(session, link)

	return nil
}

func (s *WebsocketSessionStore) GetFunctionsFromRepository(session *types.Session) error {
	var (
		files = []string{}
		dir   = filepath.Join(clonePath, session.Directory)
	)

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Println("Error walking directory #1:", err)
			return err
		}
		if !info.Mode().IsRegular() {
			return nil
		}
		ext := filepath.Ext(path)
		if slices.Contains(extensions, ext) {
			files = append(files, strings.TrimPrefix(path, dir))
		}
		return nil
	})
	if err != nil {
		fmt.Println("Error walking directory #2:", err)
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
		content, err := os.ReadFile(filepath.Join(clonePath, session.Directory, file))
		if err != nil {
			fmt.Println("Error reading file:", err)
			return err
		}

		tree, err := parser.ParseCtx(context.Background(), nil, content)
		if err != nil {
			fmt.Println("Error parsing file:", err)
			return err
		}

		getPos(tree.RootNode(), &funcBytes)
		s.AddFile(session, &types.FileFuncType{
			Path:    file,
			FuncPos: funcBytes,
		})
	}
	return nil
}

func (s *WebsocketSessionStore) GetCodeFromFile(file []byte, pos *types.FuncPostType) (string, int) {
	code := string(file[pos.StartByte:pos.EndByte])
	code = strings.ReplaceAll(code, "\n", "\\n")
	code = strings.ReplaceAll(code, "\t", "\\t")

	lineCount := 1
	for _, char := range file[:pos.StartByte] {
		if char == '\n' {
			lineCount++
		}
	}
	return code, lineCount
}

func (s *WebsocketSessionStore) CountFunctions(session *types.Session) int {
	sum := 0
	for _, v := range session.Files {
		sum += len(v.FuncPos)
	}
	return sum
}
