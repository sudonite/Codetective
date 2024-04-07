package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/sudonite/Codetective/db"
	"github.com/sudonite/Codetective/db/fixtures"
	"github.com/sudonite/Codetective/types"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type RepositorySeed struct {
	Name     string
	URL      string
	Status   types.StatusType
	Platform types.GitPlatformType
	Date     time.Time
	Files    []FileSeed
}

type FileSeed struct {
	Name      string
	Path      string
	Extension string
	Status    types.StatusType
	Date      time.Time
	Codes     []CodeSeed
}

type CodeSeed struct {
	LineStart int
	Code      string
	Status    types.StatusType
	Date      time.Time
}

type GitKeySeed struct {
	PublicKey  string
	PrivateKey string
	Platform   types.GitPlatformType
	Date       time.Time
}

type APIKeySeed struct {
	Key      string
	Platform types.APIPlatformType
	Date     time.Time
}

var repositoryies = []RepositorySeed{
	{
		Name:     "QuantumVault",
		URL:      "github.com/user/QuantumVault",
		Status:   types.Clean,
		Platform: types.Github,
		Date:     time.Date(2021, 10, 10, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "CyberByteHub",
		URL:      "gitea.com/user/CyberByteHub",
		Status:   types.Clean,
		Platform: types.Gitea,
		Date:     time.Date(2021, 10, 12, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "StellarSync",
		URL:      "github.com/user/StellarSync",
		Status:   types.Vulnerable,
		Platform: types.Github,
		Date:     time.Date(2021, 10, 14, 10, 10, 10, 0, time.UTC),
		Files: []FileSeed{
			{
				Path:      "src/handler",
				Name:      "main",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 128,
						Code:      "void insertText(std::string& document, const std::string& text, int position) {\n\tdocument.insert(position, text);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 182,
						Code:      "void deleteText(std::string& document, int start, int end) {\n\tdocument.erase(start, end - start);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 101,
						Code:      "void replaceText(std::string& document, const std::string& newText, int start, int end) {\n\tdocument.replace(start, end - start, newText);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 168,
						Code:      "int countWords(const std::string& document) {\n\tint count = 0;\n\tstd::istringstream iss(document);\n\tstd::string word;\n\twhile (iss >> word)\n\t\t++count;\n\treturn count;\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "utility",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 122,
						Code:      "int searchText(const std::string& document, const std::string& searchString) {\n\tsize_t pos = document.find(searchString);\n\tif (pos != std::string::npos)\n\t\treturn static_cast<int>(pos);\n\telse\n\t\treturn -1; // Not found\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{

						LineStart: 184,
						Code:      "void toUpperCase(std::string& document) {\n\tstd::transform(document.begin(), document.end(), document.begin(), ::toupper);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "test",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{

						LineStart: 142,
						Code:      "void toLowerCase(std::string& document) {\n\tstd::transform(document.begin(), document.end(), document.begin(), ::tolower);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "data",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 10,
						Code:      "void trimWhitespace(std::string& document) {\n\tdocument.erase(std::remove_if(document.begin(), document.end(), ::isspace), document.end());\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
		},
	},
	{
		Name:     "CodeCrazeLab",
		URL:      "gitlab.com/user/CodeCrazeLab",
		Status:   types.Vulnerable,
		Platform: types.Gitlab,
		Date:     time.Date(2021, 10, 16, 10, 10, 10, 0, time.UTC),
		Files: []FileSeed{
			{
				Path:      "src/handler",
				Name:      "gui",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 188,
						Code:      "std::string extractSubstring(const std::string& document, int start, int length) {\n\treturn document.substr(start, length);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "network",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 16,
						Code:      "void reverseText(std::string& document) {\n\tstd::reverse(document.begin(), document.end());\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 108,
						Code:      "void findAndReplace(std::string& document, const std::string& search, const std::string& replace) {\n\tsize_t pos = document.find(search);\n\twhile (pos != std::string::npos) {\n\t\tdocument.replace(pos, search.length(), replace);\n\t\tpos = document.find(search, pos + replace.length());\n\t}\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 12,
						Code:      "int countOccurrences(const std::string& document, const std::string& substring) {\n\tint count = 0;\n\tsize_t pos = document.find(substring);\n\twhile (pos != std::string::npos) {\n\t\t++count;\n\t\tpos = document.find(substring, pos + substring.length());\n\t}\n\treturn count;\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "math",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 18,
						Code:      "void insertLine(std::string& document, const std::string& line, int lineNumber) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string currentLine;\n\twhile (std::getline(iss, currentLine))\n\t\tlines.push_back(currentLine);\n\tif (lineNumber >= 0 && lineNumber <= lines.size())\n\t\tlines.insert(lines.begin() + lineNumber, line);\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
		},
	},
	{
		Name:     "NexusForge",
		URL:      "bitbucket.com/user/NexusForge",
		Status:   types.Running,
		Platform: types.Bitbucket,
		Date:     time.Date(2023, 10, 18, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "ByteBlitzInc",
		URL:      "github.com/user/ByteBlitzInc",
		Status:   types.Clean,
		Platform: types.Github,
		Date:     time.Date(2021, 10, 20, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "CloudCipherRepo",
		URL:      "gitlab.com/user/CloudCipherRepo",
		Status:   types.Clean,
		Platform: types.Gitlab,
		Date:     time.Date(2021, 10, 22, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "DataNinjaDen",
		URL:      "github.com/user/DataNinjaDen",
		Status:   types.Vulnerable,
		Platform: types.Github,
		Date:     time.Date(2021, 10, 24, 10, 10, 10, 0, time.UTC),
		Files: []FileSeed{
			{
				Path:      "src/handler",
				Name:      "image",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 162,
						Code:      "void deleteLine(std::string& document, int lineNumber) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string currentLine;\n\twhile (std::getline(iss, currentLine))\n\t\tlines.push_back(currentLine);\n\tif (lineNumber >= 0 && lineNumber < lines.size())\n\t\tlines.erase(lines.begin() + lineNumber);\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "audio",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 112,
						Code:      "std::string extractLine(const std::string& document, int lineNumber) {\n\tstd::istringstream iss(document);\n\tstd::string currentLine;\n\tfor (int i = 0; i < lineNumber; ++i)\n\t\tstd::getline(iss, currentLine);\n\treturn currentLine;\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
		},
	},
	{
		Name:     "PulseParseHub",
		URL:      "github.com/user/PulseParseHub",
		Status:   types.Clean,
		Platform: types.Github,
		Date:     time.Date(2021, 10, 26, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "InfinityInnovate",
		URL:      "bitbucket.com/user/InfinityInnovate",
		Status:   types.Vulnerable,
		Platform: types.Bitbucket,
		Date:     time.Date(2021, 9, 16, 10, 10, 10, 0, time.UTC),
		Files: []FileSeed{
			{
				Path:      "src/handler",
				Name:      "store",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 102,
						Code:      "int getDocumentLength(const std::string& document) {\n\treturn document.length();\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{Path: "src/handler",
				Name:      "write",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 186,
						Code:      "void clearDocument(std::string& document) {\n\tdocument.clear();\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 104,
						Code:      "std::string copyText(const std::string& document, int start, int end) {\n\treturn document.substr(start, end - start);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "handle",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 164,
						Code:      "void pasteText(std::string& document, const std::string& text, int position) {\n\tdocument.insert(position, text);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
		},
	},
	{
		Name:     "FusionFrameWorks",
		URL:      "gitea.com/user/FusionFrameWorks",
		Status:   types.Clean,
		Platform: types.Gitea,
		Date:     time.Date(2021, 9, 26, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "SparkStreamRepo",
		URL:      "gitea.com/user/SparkStreamRepo",
		Status:   types.Clean,
		Platform: types.Gitea,
		Date:     time.Date(2021, 06, 11, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "TechTroveVault",
		URL:      "gitlab.com/user/TechTroveVault",
		Status:   types.Clean,
		Platform: types.Gitlab,
		Date:     time.Date(2021, 10, 26, 10, 12, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "BitBoltBase",
		URL:      "bitbucket.com/user/BitBoltBase",
		Status:   types.Vulnerable,
		Platform: types.Bitbucket,
		Date:     time.Date(2021, 10, 26, 04, 10, 10, 0, time.UTC),
		Files: []FileSeed{
			{
				Path:      "src/handler",
				Name:      "server",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 118,
						Code:      "void undo(std::string& document, const std::string& previousState) {\n\tdocument = previousState;\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "send",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 180,
						Code:      "void mergeDocuments(std::string& targetDocument, const std::string& sourceDocument, int position) {\n\ttargetDocument.insert(position, sourceDocument);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "read",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 148,
						Code:      "std::vector<std::string> splitDocument(const std::string& document, char delimiter) {\n\tstd::vector<std::string> result;\n\tstd::istringstream iss(document);\n\tstd::string token;\n\twhile (std::getline(iss, token, delimiter)) {\n\t\tresult.push_back(token);\n\t}\n\treturn result;\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
		},
	},
	{
		Name:     "NeuralNook",
		URL:      "bitbucket.com/user/NeuralNook",
		Status:   types.Clean,
		Platform: types.Bitbucket,
		Date:     time.Date(2021, 10, 26, 20, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "QuantumQuarry",
		URL:      "gitlab.com/user/QuantumQuarry",
		Status:   types.Clean,
		Platform: types.Gitlab,
		Date:     time.Date(2021, 10, 26, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "EchoEngineRepo",
		URL:      "github.com/user/EchoEngineRepo",
		Status:   types.Clean,
		Platform: types.Github,
		Date:     time.Date(2020, 10, 26, 10, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
	{
		Name:     "CipherSprintHub",
		URL:      "github.com/user/CipherSprintHub",
		Status:   types.Vulnerable,
		Platform: types.Github,
		Date:     time.Date(2021, 10, 26, 15, 10, 10, 0, time.UTC),
		Files: []FileSeed{
			{
				Path:      "src/handler",
				Name:      "reset",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 11,
						Code:      "void sortLines(std::string& document) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string line;\n\twhile (std::getline(iss, line))\n\t\tlines.push_back(line);\n\tstd::sort(lines.begin(), lines.end());\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 182,
						Code:      "void indentText(std::string& document, int spaces, int startLine, int endLine) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string line;\n\tint currentLine = 0;\n\twhile (std::getline(iss, line)) {\n\t\t++currentLine;\n\t\tif (currentLine >= startLine && currentLine <= endLine) {\n\t\t\tline.insert(0, spaces, ' ');\n\t\t}\n\t\tlines.push_back(line);\n\t}\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 14,
						Code:      "void highlightText(std::string& document, int start, int end) {\n\t// Example: Wrap the highlighted text with <mark> tag\n\tdocument.insert(start, \"<mark>\");\n\tdocument.insert(end + 6, \"</mark>\");\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 18,
						Code:      "void commentLines(std::string& document, const std::string& commentPrefix, int startLine, int endLine) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string line;\n\tint currentLine = 0;\n\twhile (std::getline(iss, line)) {\n\t\t++currentLine;\n\t\tif (currentLine >= startLine && currentLine <= endLine) {\n\t\t\tline.insert(0, commentPrefix);\n\t\t}\n\t\tlines.push_back(line);\n\t}\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 166,
						Code:      "std::vector<std::string> spellCheck(const std::string& document) {\n\tstd::vector<std::string> mistakes;\n\t// Implement spell checking logic here\n\treturn mistakes;\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "replace",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 114,
						Code:      "void replaceTabsWithSpaces(std::string& document, int spacesPerTab) {\n\tsize_t pos = document.find('\t');\n\twhile (pos != std::string::npos) {\n\t\tdocument.replace(pos, 1, spacesPerTab, ' ');\n\t\tpos = document.find('\t', pos + spacesPerTab);\n\t}\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 18,
						Code:      "void insertTimestamp(std::string& document) {\n\tstd::time_t now = std::time(nullptr);\n\tstd::tm* currentTime = std::localtime(&now);\n\tchar timestamp[20];\n\tstd::strftime(timestamp, sizeof(timestamp), \"%Y-%m-%d %H:%M:%S\", currentTime);\n\tdocument += timestamp;\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 106,
						Code:      "void encryptDocument(std::string& document, const std::string& encryptionKey) {\n\t// Implement encryption logic here using the encryptionKey\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
		},
	},
	{
		Name:     "CodeCraftWorks",
		URL:      "gitea.com/user/CodeCraftWorks",
		Status:   types.Vulnerable,
		Platform: types.Gitea,
		Date:     time.Date(2021, 11, 20, 10, 10, 10, 0, time.UTC),
		Files: []FileSeed{
			{
				Path:      "src/handler",
				Name:      "calculate",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 160,
						Code:      "void insertCharacter(std::string& document, char character, int position) {\n\tdocument.insert(position, 1, character);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "reload",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 116,
						Code:      "void deleteCharacter(std::string& document, int position) {\n\tif (position >= 0 && position < document.length())\n\t\tdocument.erase(position, 1);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 18,
						Code:      "void moveCursor(int& cursorPosition, int newPosition, int documentLength) {\n\tif (newPosition >= 0 && newPosition <= documentLength)\n\t\tcursorPosition = newPosition;\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
			{
				Path:      "src/handler",
				Name:      "config",
				Extension: "cpp",
				Status:    types.Vulnerable,
				Date:      time.Now(),
				Codes: []CodeSeed{
					{
						LineStart: 124,
						Code:      "std::string getSelectedText(const std::string& document, int selectionStart, int selectionEnd) {\n\treturn document.substr(selectionStart, selectionEnd - selectionStart);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 18,
						Code:      "void scroll(int& scrollPosition, int scrollAmount, int documentLength, int visibleAreaSize) {\n\tint maxScroll = documentLength - visibleAreaSize;\n\tscrollPosition = std::max(0, std::min(maxScroll, scrollPosition + scrollAmount));\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 100,
						Code:      "void setTextColor(std::string& document, int start, int end, const std::string& color) {\n\t// Add HTML tags for color\n\tdocument.insert(start, \"<span style=\"color: \" + color + \"\">\");\n\tdocument.insert(end + 1, \"</span>\");\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 161,
						Code:      "void insertLink(std::string& document, const std::string& url, int start, int end) {\n\t// Add HTML tags for hyperlink\n\tdocument.insert(start, \"<a href=\"\" + url + \"\">\");\n\tdocument.insert(end + url.length() + 9, \"</a>\");\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 110,
						Code:      "void insertImage(std::string& document, const std::string& imageUrl, int position) {\n\t// Add HTML tag for image\n\tdocument.insert(position, \"<img src=\"\" + imageUrl + \"\">\");\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 184,
						Code:      "void indentText(std::string& document, int start, int end, int numSpaces) {\n\tstd::string spaces(numSpaces, ' ');\n\tstd::string::iterator it = std::find_if(document.begin() + start, document.begin() + end, [](char c) { return !std::isspace(c); });\n\tdocument.insert(it, spaces);\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
					{
						LineStart: 146,
						Code:      "void sortLines(std::string& document) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string line;\n\twhile (std::getline(iss, line))\n\t\tlines.push_back(line);\n\tstd::sort(lines.begin(), lines.end());\n\tdocument.clear();\n\tfor (const auto& sortedLine : lines)\n\t\tdocument += sortedLine + '\n';\n}",
						Status:    types.Vulnerable,
						Date:      time.Now(),
					},
				},
			},
		},
	},
	{
		Name:     "AlphaAlgorithmRepo",
		URL:      "gitlab.com/user/AlphaAlgorithmRepo",
		Status:   types.Clean,
		Platform: types.Gitlab,
		Date:     time.Date(2021, 10, 14, 11, 10, 10, 0, time.UTC),
		Files:    []FileSeed{},
	},
}

var gitKeys = []GitKeySeed{
	{
		PublicKey:  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPFJgYE7mTnfW1+jGvnUPIZK1HoeEUH1nFphe+oH+41K admin@codetective",
		PrivateKey: `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\nQyNTUxOQAAACDxSYGBO5k531tfoxr51DyGStR6HhFB9ZxaYXvqB/uNSgAAAJD3Wdh691nY\negAAAAtzc2gtZWQyNTUxOQAAACDxSYGBO5k531tfoxr51DyGStR6HhFB9ZxaYXvqB/uNSg\nAAAEAgn7ynyiFL1UlFZJuYAqdN8AmR0aTHqGW089N+woA/+PFJgYE7mTnfW1+jGvnUPIZK\n1HoeEUH1nFphe+oH+41KAAAADXN1ZG9uaXRlQGFyY2g=\n-----END OPENSSH PRIVATE KEY-----`,
		Platform:   types.Github,
		Date:       time.Now(),
	},
	{
		PublicKey:  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBalyqUKVS+5v/FICoU+fS1JdRnUE1ia0LCzTwDcclx4 admin@codetective",
		PrivateKey: `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\nQyNTUxOQAAACAWpcqlClUvub/xSAqFPn0tSXUZ1BNYmtCws08A3HJceAAAAJBmJB6RZiQe\nkQAAAAtzc2gtZWQyNTUxOQAAACAWpcqlClUvub/xSAqFPn0tSXUZ1BNYmtCws08A3HJceA\nAAAEAhW2CsP/fOE6gN1rZBm+/4E83r7l1IaGyhAcvNcsiqshalyqUKVS+5v/FICoU+fS1J\ndRnUE1ia0LCzTwDcclx4AAAADXN1ZG9uaXRlQGFyY2g=\n-----END OPENSSH PRIVATE KEY-----`,
		Platform:   types.Gitlab,
		Date:       time.Now(),
	},
	{
		PublicKey:  "",
		PrivateKey: "",
		Platform:   types.Gitea,
		Date:       time.Now(),
	},
	{
		PublicKey:  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKt1WYWdPC4NoquC0aZGXzreNxCWkVxl0rNmzXb6VHcr admin@codetective",
		PrivateKey: `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\nQyNTUxOQAAACCrdVmFnTwuDaKrgtGmRl863jcQlpFcZdKzZs12+lR3KwAAAJC6Fx43uhce\nNwAAAAtzc2gtZWQyNTUxOQAAACCrdVmFnTwuDaKrgtGmRl863jcQlpFcZdKzZs12+lR3Kw\nAAAEBb6LZv1W9cYOjPjg2rGZ9VfhCE5qY0ahpDf5WwB13elat1WYWdPC4NoquC0aZGXzre\nNxCWkVxl0rNmzXb6VHcrAAAADXN1ZG9uaXRlQGFyY2g=\n-----END OPENSSH PRIVATE KEY-----`,
		Platform:   types.Bitbucket,
		Date:       time.Now(),
	},
}

var apiKeys = []APIKeySeed{
	{
		Key:      "",
		Platform: types.Colab,
		Date:     time.Now(),
	},
	{
		Key:      "35b997af-1644-4484-b456-f7dc1e1ebe3c",
		Platform: types.Kaggle,
		Date:     time.Now(),
	},
	{
		Key:      "19f20913-8712-4e52-a0f5-e11e0ac678bd",
		Platform: types.OpenAI,
		Date:     time.Now(),
	},
	{
		Key:      "5fae1c9b-5ee6-4835-8248-450ac0b7d5e9",
		Platform: types.Perplexity,
		Date:     time.Now(),
	},
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}
	var (
		ctx           = context.Background()
		mongoEndpoint = os.Getenv("MONGO_DB_URL")
		mongoDBName   = os.Getenv("MONGO_DB_NAME")
		username      = "admin"
		password      = "admin"
	)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoEndpoint))
	if err != nil {
		log.Fatal(err)
	}
	if err := client.Database(mongoDBName).Drop(ctx); err != nil {
		log.Fatal(err)
	}
	store := &db.Store{
		User:         db.NewMongoUserStore(client),
		Repository:   db.NewMongoRepositoryStore(client),
		File:         db.NewMongoFileStore(client),
		Code:         db.NewMongoCodeStore(client),
		GitKey:       db.NewMongoGitKeyStore(client),
		APIKey:       db.NewMongoAPIKeyStore(client),
		Subscription: db.NewMongoSubscriptionStore(client),
	}

	user := fixtures.AddUser(store, "Teszt", "Elek", username, password, true)
	fmt.Printf("User created: %s -> %s", user.Email, password)

	fixtures.AddUser(store, "Teszt1", "Elek1", "user1", "user1", false)
	fixtures.AddUser(store, "Teszt2", "Elek2", "user2", "user2", false)
	fixtures.AddUser(store, "Teszt3", "Elek3", "user3", "user3", false)
	fixtures.AddUser(store, "Teszt4", "Elek4", "user4", "user4", false)

	fixtures.AddSubscription(store, user.ID, types.Free, time.Date(2050, 1, 1, 0, 0, 0, 0, time.UTC))

	for _, r := range repositoryies {
		repository := fixtures.AddRepository(store, user.ID, r.Name, r.URL, r.Status, r.Platform, r.Date)
		for _, f := range r.Files {
			file := fixtures.AddFile(store, repository.ID, f.Name, f.Path, f.Extension, f.Status, f.Date)
			for _, c := range f.Codes {
				fixtures.AddCode(store, file.ID, c.Status, c.LineStart, c.Code, c.Date)
			}
		}
	}

	for _, g := range gitKeys {
		fixtures.AddGitKey(store, user.ID, g.PublicKey, g.PrivateKey, g.Platform, g.Date)
	}

	for _, a := range apiKeys {
		fixtures.AddAPIKey(store, user.ID, a.Key, a.Platform, a.Date)
	}
}
