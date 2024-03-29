import {
  Files,
  Repositories,
  Codes,
  Status,
  ChatMessage,
  GitKeys,
  AppKeys,
} from "@/Types";
import { generateRandomDate } from "@/Utils";

const repositories: Repositories = [
  {
    id: 1,
    name: "QuantumVault",
    url: "github.com/user/QuantumVault",
    status: "clean",
    platform: "github",
    date: new Date("2021-10-10T10:10:10Z"),
  },
  {
    id: 2,
    name: "CyberByteHub",
    url: "gitea.com/user/CyberByteHub",
    status: "clean",
    platform: "gitea",
    date: new Date("2021-10-12T10:10:10Z"),
  },
  {
    id: 3,
    name: "StellarSync",
    url: "github.com/user/StellarSync",
    status: "vulnerable",
    platform: "github",
    date: new Date("2021-10-14T10:10:10Z"),
  },
  {
    id: 4,
    name: "CodeCrazeLab",
    url: "gitlab.com/user/CodeCrazeLab",
    status: "vulnerable",
    platform: "gitlab",
    date: new Date("2021-10-16T10:10:10Z"),
  },
  {
    id: 5,
    name: "NexusForge",
    url: "bitbucket.com/user/NexusForge",
    status: "running",
    platform: "bitbucket",
    date: new Date("2023-10-18T10:10:10Z"),
  },
  {
    id: 6,
    name: "ByteBlitzInc",
    url: "github.com/user/ByteBlitzInc",
    status: "clean",
    platform: "github",
    date: new Date("2021-10-20T10:10:10Z"),
  },
  {
    id: 7,
    name: "CloudCipherRepo",
    url: "gitlab.com/user/CloudCipherRepo",
    status: "clean",
    platform: "gitlab",
    date: new Date("2021-10-22T10:10:10Z"),
  },
  {
    id: 8,
    name: "DataNinjaDen",
    url: "github.com/user/DataNinjaDen",
    status: "vulnerable",
    platform: "github",
    date: new Date("2021-10-24T10:10:10Z"),
  },
  {
    id: 9,
    name: "PulseParseHub",
    url: "github.com/user/PulseParseHub",
    status: "clean",
    platform: "github",
    date: new Date("2021-10-26T10:10:10Z"),
  },
  {
    id: 10,
    name: "InfinityInnovate",
    url: "bitbucket.com/user/InfinityInnovate",
    status: "vulnerable",
    platform: "bitbucket",
    date: new Date("2021-09-16T10:10:10Z"),
  },
  {
    id: 11,
    name: "FusionFrameWorks",
    url: "gitea.com/user/FusionFrameWorks",
    status: "clean",
    platform: "gitea",
    date: new Date("2021-09-26T10:10:10Z"),
  },
  {
    id: 12,
    name: "SparkStreamRepo",
    url: "gitea.com/user/SparkStreamRepo",
    status: "clean",
    platform: "gitea",
    date: new Date("2021-06-11T10:10:10Z"),
  },
  {
    id: 13,
    name: "TechTroveVault",
    url: "gitlab.com/user/TechTroveVault",
    status: "clean",
    platform: "gitlab",
    date: new Date("2021-10-26T10:12:10Z"),
  },
  {
    id: 14,
    name: "BitBoltBase",
    url: "bitbucket.com/user/BitBoltBase",
    status: "vulnerable",
    platform: "bitbucket",
    date: new Date("2021-10-26T04:10:10Z"),
  },
  {
    id: 15,
    name: "NeuralNook",
    url: "bitbucket.com/user/NeuralNook",
    status: "clean",
    platform: "bitbucket",
    date: new Date("2021-10-26T20:10:10Z"),
  },
  {
    id: 16,
    name: "QuantumQuarry",
    url: "gitlab.com/user/QuantumQuarry",
    status: "clean",
    platform: "gitlab",
    date: new Date("2021-10-26T10:10:10Z"),
  },
  {
    id: 17,
    name: "EchoEngineRepo",
    url: "github.com/user/EchoEngineRepo",
    status: "clean",
    platform: "github",
    date: new Date("2020-10-26T10:10:10Z"),
  },
  {
    id: 18,
    name: "CipherSprintHub",
    url: "github.com/user/CipherSprintHub",
    status: "vulnerable",
    platform: "github",
    date: new Date("2021-10-26T15:10:10Z"),
  },
  {
    id: 19,
    name: "CodeCraftWorks",
    url: "gitea.com/user/CodeCraftWorks",
    status: "vulnerable",
    platform: "gitea",
    date: new Date("2021-11-20T10:10:10Z"),
  },
  {
    id: 20,
    name: "AlphaAlgorithmRepo",
    url: "gitlab.com/user/AlphaAlgorithmRepo",
    status: "clean",
    platform: "gitlab",
    date: new Date("2021-10-14T11:10:10Z"),
  },
];

const files: Files = [
  {
    id: 1,
    path: "src/handler/",
    name: "main",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 2,
    path: "src/handler/",
    name: "utility",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 3,
    path: "src/handler/",
    name: "test",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 4,
    path: "src/handler/",
    name: "data",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 5,
    path: "src/handler/",
    name: "gui",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 6,
    path: "src/handler/",
    name: "network",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 7,
    path: "src/handler/",
    name: "math",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 8,
    path: "src/handler/",
    name: "image",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 9,
    path: "src/handler/",
    name: "audio",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 10,
    path: "src/handler/",
    name: "store",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 11,
    path: "src/handler/",
    name: "write",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 12,
    path: "src/handler/",
    name: "handle",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 13,
    path: "src/handler/",
    name: "server",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 14,
    path: "src/handler/",
    name: "send",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 15,
    path: "src/handler/",
    name: "read",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 16,
    path: "src/handler/",
    name: "reset",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 17,
    path: "src/handler/",
    name: "replace",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 18,
    path: "src/handler/",
    name: "calculate",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 19,
    path: "src/handler/",
    name: "reload",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 20,
    path: "src/handler/",
    name: "config",
    extension: "cpp",
    status: "vulnerable",
    date: new Date(),
  },
];

const repositoryFiles: number[][] = [
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [4, 5],
  [4, 6],
  [4, 7],
  [8, 8],
  [8, 9],
  [10, 10],
  [10, 11],
  [10, 12],
  [14, 13],
  [14, 14],
  [14, 15],
  [18, 16],
  [18, 17],
  [19, 18],
  [19, 19],
  [19, 20],
];

const codes: Codes = [
  {
    id: 1,
    lineStart: 128,
    code: "void insertText(std::string& document, const std::string& text, int position) {\n\tdocument.insert(position, text);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 2,
    lineStart: 182,
    code: "void deleteText(std::string& document, int start, int end) {\n\tdocument.erase(start, end - start);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 3,
    lineStart: 101,
    code: "void replaceText(std::string& document, const std::string& newText, int start, int end) {\n\tdocument.replace(start, end - start, newText);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 4,
    lineStart: 168,
    code: "int countWords(const std::string& document) {\n\tint count = 0;\n\tstd::istringstream iss(document);\n\tstd::string word;\n\twhile (iss >> word)\n\t\t++count;\n\treturn count;\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 5,
    lineStart: 122,
    code: "int searchText(const std::string& document, const std::string& searchString) {\n\tsize_t pos = document.find(searchString);\n\tif (pos != std::string::npos)\n\t\treturn static_cast<int>(pos);\n\telse\n\t\treturn -1; // Not found\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 6,
    lineStart: 184,
    code: "void toUpperCase(std::string& document) {\n\tstd::transform(document.begin(), document.end(), document.begin(), ::toupper);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 7,
    lineStart: 142,
    code: "void toLowerCase(std::string& document) {\n\tstd::transform(document.begin(), document.end(), document.begin(), ::tolower);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 8,
    lineStart: 10,
    code: "void trimWhitespace(std::string& document) {\n\tdocument.erase(std::remove_if(document.begin(), document.end(), ::isspace), document.end());\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 9,
    lineStart: 188,
    code: "std::string extractSubstring(const std::string& document, int start, int length) {\n\treturn document.substr(start, length);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 10,
    lineStart: 16,
    code: "void reverseText(std::string& document) {\n\tstd::reverse(document.begin(), document.end());\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 11,
    lineStart: 108,
    code: "void findAndReplace(std::string& document, const std::string& search, const std::string& replace) {\n\tsize_t pos = document.find(search);\n\twhile (pos != std::string::npos) {\n\t\tdocument.replace(pos, search.length(), replace);\n\t\tpos = document.find(search, pos + replace.length());\n\t}\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 12,
    lineStart: 12,
    code: "int countOccurrences(const std::string& document, const std::string& substring) {\n\tint count = 0;\n\tsize_t pos = document.find(substring);\n\twhile (pos != std::string::npos) {\n\t\t++count;\n\t\tpos = document.find(substring, pos + substring.length());\n\t}\n\treturn count;\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 13,
    lineStart: 18,
    code: "void insertLine(std::string& document, const std::string& line, int lineNumber) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string currentLine;\n\twhile (std::getline(iss, currentLine))\n\t\tlines.push_back(currentLine);\n\tif (lineNumber >= 0 && lineNumber <= lines.size())\n\t\tlines.insert(lines.begin() + lineNumber, line);\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 14,
    lineStart: 162,
    code: "void deleteLine(std::string& document, int lineNumber) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string currentLine;\n\twhile (std::getline(iss, currentLine))\n\t\tlines.push_back(currentLine);\n\tif (lineNumber >= 0 && lineNumber < lines.size())\n\t\tlines.erase(lines.begin() + lineNumber);\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 15,
    lineStart: 112,
    code: "std::string extractLine(const std::string& document, int lineNumber) {\n\tstd::istringstream iss(document);\n\tstd::string currentLine;\n\tfor (int i = 0; i < lineNumber; ++i)\n\t\tstd::getline(iss, currentLine);\n\treturn currentLine;\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 16,
    lineStart: 102,
    code: "int getDocumentLength(const std::string& document) {\n\treturn document.length();\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 17,
    lineStart: 186,
    code: "void clearDocument(std::string& document) {\n\tdocument.clear();\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 18,
    lineStart: 104,
    code: "std::string copyText(const std::string& document, int start, int end) {\n\treturn document.substr(start, end - start);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 19,
    lineStart: 164,
    code: "void pasteText(std::string& document, const std::string& text, int position) {\n\tdocument.insert(position, text);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 20,
    lineStart: 118,
    code: "void undo(std::string& document, const std::string& previousState) {\n\tdocument = previousState;\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 21,
    lineStart: 180,
    code: "void mergeDocuments(std::string& targetDocument, const std::string& sourceDocument, int position) {\n\ttargetDocument.insert(position, sourceDocument);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 22,
    lineStart: 148,
    code: "std::vector<std::string> splitDocument(const std::string& document, char delimiter) {\n\tstd::vector<std::string> result;\n\tstd::istringstream iss(document);\n\tstd::string token;\n\twhile (std::getline(iss, token, delimiter)) {\n\t\tresult.push_back(token);\n\t}\n\treturn result;\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 23,
    lineStart: 11,
    code: "void sortLines(std::string& document) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string line;\n\twhile (std::getline(iss, line))\n\t\tlines.push_back(line);\n\tstd::sort(lines.begin(), lines.end());\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 24,
    lineStart: 182,
    code: "void indentText(std::string& document, int spaces, int startLine, int endLine) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string line;\n\tint currentLine = 0;\n\twhile (std::getline(iss, line)) {\n\t\t++currentLine;\n\t\tif (currentLine >= startLine && currentLine <= endLine) {\n\t\t\tline.insert(0, spaces, ' ');\n\t\t}\n\t\tlines.push_back(line);\n\t}\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 25,
    lineStart: 14,
    code: 'void highlightText(std::string& document, int start, int end) {\n\t// Example: Wrap the highlighted text with <mark> tag\n\tdocument.insert(start, "<mark>");\n\tdocument.insert(end + 6, "</mark>");\n}',
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 26,
    lineStart: 18,
    code: "void commentLines(std::string& document, const std::string& commentPrefix, int startLine, int endLine) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string line;\n\tint currentLine = 0;\n\twhile (std::getline(iss, line)) {\n\t\t++currentLine;\n\t\tif (currentLine >= startLine && currentLine <= endLine) {\n\t\t\tline.insert(0, commentPrefix);\n\t\t}\n\t\tlines.push_back(line);\n\t}\n\tdocument.clear();\n\tfor (const auto& l : lines)\n\t\tdocument += l + '\n';\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 27,
    lineStart: 166,
    code: "std::vector<std::string> spellCheck(const std::string& document) {\n\tstd::vector<std::string> mistakes;\n\t// Implement spell checking logic here\n\treturn mistakes;\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 28,
    lineStart: 114,
    code: "void replaceTabsWithSpaces(std::string& document, int spacesPerTab) {\n\tsize_t pos = document.find('\t');\n\twhile (pos != std::string::npos) {\n\t\tdocument.replace(pos, 1, spacesPerTab, ' ');\n\t\tpos = document.find('\t', pos + spacesPerTab);\n\t}\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 29,
    lineStart: 18,
    code: 'void insertTimestamp(std::string& document) {\n\tstd::time_t now = std::time(nullptr);\n\tstd::tm* currentTime = std::localtime(&now);\n\tchar timestamp[20];\n\tstd::strftime(timestamp, sizeof(timestamp), "%Y-%m-%d %H:%M:%S", currentTime);\n\tdocument += timestamp;\n}',
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 30,
    lineStart: 106,
    code: "void encryptDocument(std::string& document, const std::string& encryptionKey) {\n\t// Implement encryption logic here using the encryptionKey\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 31,
    lineStart: 160,
    code: "void insertCharacter(std::string& document, char character, int position) {\n\tdocument.insert(position, 1, character);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 32,
    lineStart: 116,
    code: "void deleteCharacter(std::string& document, int position) {\n\tif (position >= 0 && position < document.length())\n\t\tdocument.erase(position, 1);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 33,
    lineStart: 18,
    code: "void moveCursor(int& cursorPosition, int newPosition, int documentLength) {\n\tif (newPosition >= 0 && newPosition <= documentLength)\n\t\tcursorPosition = newPosition;\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 34,
    lineStart: 124,
    code: "std::string getSelectedText(const std::string& document, int selectionStart, int selectionEnd) {\n\treturn document.substr(selectionStart, selectionEnd - selectionStart);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 35,
    lineStart: 18,
    code: "void scroll(int& scrollPosition, int scrollAmount, int documentLength, int visibleAreaSize) {\n\tint maxScroll = documentLength - visibleAreaSize;\n\tscrollPosition = std::max(0, std::min(maxScroll, scrollPosition + scrollAmount));\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 36,
    lineStart: 100,
    code: 'void setTextColor(std::string& document, int start, int end, const std::string& color) {\n\t// Add HTML tags for color\n\tdocument.insert(start, "<span style="color: " + color + "">");\n\tdocument.insert(end + 1, "</span>");\n}',
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 37,
    lineStart: 161,
    code: 'void insertLink(std::string& document, const std::string& url, int start, int end) {\n\t// Add HTML tags for hyperlink\n\tdocument.insert(start, "<a href="" + url + "">");\n\tdocument.insert(end + url.length() + 9, "</a>");\n}',
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 38,
    lineStart: 110,
    code: 'void insertImage(std::string& document, const std::string& imageUrl, int position) {\n\t// Add HTML tag for image\n\tdocument.insert(position, "<img src="" + imageUrl + "">");\n}',
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 39,
    lineStart: 184,
    code: "void indentText(std::string& document, int start, int end, int numSpaces) {\n\tstd::string spaces(numSpaces, ' ');\n\tstd::string::iterator it = std::find_if(document.begin() + start, document.begin() + end, [](char c) { return !std::isspace(c); });\n\tdocument.insert(it, spaces);\n}",
    status: "vulnerable",
    date: new Date(),
  },
  {
    id: 40,
    lineStart: 146,
    code: "void sortLines(std::string& document) {\n\tstd::istringstream iss(document);\n\tstd::vector<std::string> lines;\n\tstd::string line;\n\twhile (std::getline(iss, line))\n\t\tlines.push_back(line);\n\tstd::sort(lines.begin(), lines.end());\n\tdocument.clear();\n\tfor (const auto& sortedLine : lines)\n\t\tdocument += sortedLine + '\n';\n}",
    status: "vulnerable",
    date: new Date(),
  },
];

const fileCodes: number[][] = [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [3, 7],
  [4, 8],
  [5, 9],
  [6, 10],
  [6, 11],
  [6, 12],
  [7, 13],
  [8, 14],
  [9, 15],
  [10, 16],
  [11, 17],
  [11, 18],
  [12, 19],
  [13, 20],
  [14, 21],
  [15, 22],
  [16, 23],
  [16, 24],
  [16, 25],
  [16, 26],
  [16, 27],
  [17, 28],
  [17, 29],
  [17, 30],
  [18, 31],
  [19, 32],
  [19, 33],
  [20, 34],
  [20, 35],
  [20, 36],
  [20, 37],
  [20, 38],
  [20, 39],
  [20, 40],
];

const chatMessage: ChatMessage = {
  id: 1,
  message:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  sender: "bot",
  date: new Date(),
};

const gitKeys: GitKeys = [
  {
    id: 1,
    key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJsJerWmr8oqTh43dnEM78UH24jKwaKDyfI2VPrLu5wY sudonite@codetective",
    platform: "github",
    date: generateRandomDate(),
  },
  {
    id: 2,
    key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFlLnIKfwAj+weYn7hA81DBHmIa6Z8+UTYy1/2or6YIC sudonite@codetective",
    platform: "gitlab",
    date: generateRandomDate(),
  },
  {
    id: 3,
    key: null,
    platform: "gitea",
    date: generateRandomDate(),
  },
  {
    id: 4,
    key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBVPUbPfSuVA5BIu+4Uma1gW1eWPzBiHzslVWmVFZcK9 sudonite@codetective",
    platform: "bitbucket",
    date: generateRandomDate(),
  },
];

const appKeys: AppKeys = [
  {
    id: 1,
    key: null,
    platform: "colab",
    date: generateRandomDate(),
  },
  {
    id: 2,
    key: "35b997af-1644-4484-b456-f7dc1e1ebe3c",
    platform: "kaggle",
    date: generateRandomDate(),
  },
  {
    id: 3,
    key: "19f20913-8712-4e52-a0f5-e11e0ac678bd",
    platform: "gpt",
    date: generateRandomDate(),
  },
  {
    id: 4,
    key: "5fae1c9b-5ee6-4835-8248-450ac0b7d5e9",
    platform: "perplexity",
    date: generateRandomDate(),
  },
];

export const getRepositories = (): { data: Repositories; status: number } => {
  return { data: repositories, status: 200 };
};

export const getFiles = (id: number): { data: Files; status: number } => {
  const fileIds = repositoryFiles
    .filter(file => file[0] === id)
    .map(file => file[1]);
  return { data: files.filter(file => fileIds.includes(file.id)), status: 200 };
};

export const getCodes = (id: number): { data: Codes; status: number } => {
  const codeIds = fileCodes.filter(code => code[0] === id).map(code => code[1]);
  return { data: codes.filter(code => codeIds.includes(code.id)), status: 200 };
};

export const changeStatus = (
  id: number,
  status: Status
): { status: number } => {
  const code = codes.find(code => code.id === id);
  if (code) code.status = status;
  return { status: 200 };
};

export const receiveAnswer = () => {
  return { data: chatMessage, status: 200 };
};

export const getGitKeys = (): { data: GitKeys; status: number } => {
  return { data: gitKeys, status: 200 };
};

export const getAppKeys = (): { data: AppKeys; status: number } => {
  return { data: appKeys, status: 200 };
};
