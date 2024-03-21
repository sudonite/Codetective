export type Status = "clean" | "vulnerable" | "running" | "fixed" | "false";
export type GitPlatform = "github" | "gitlab" | "gitea" | "bitbucket";
export type AppPlatform = "colab" | "kaggle" | "gpt" | "perplexity";
export type Sender = "user" | "bot";

export interface Repository {
  id: number;
  name: string;
  url: string;
  status: Status;
  platform: GitPlatform;
  date: Date;
}

export interface File {
  id: number;
  name: string;
  path: string;
  extension: string;
  status: Status;
  date: Date;
}

export interface Code {
  id: number;
  lineStart: number;
  code: string;
  status: Status;
  date: Date;
}

export interface ChatMessage {
  id: number;
  message: string;
  sender: Sender;
  date: Date;
}

export interface GitKey {
  id: number;
  key: string | null;
  platform: GitPlatform;
  date: Date;
}

export interface AppKey {
  id: number;
  key: string | null;
  platform: AppPlatform;
  date: Date;
}

export type Repositories = Repository[];
export type Files = File[];
export type Codes = Code[];
export type ChatMessages = ChatMessage[];
export type GitKeys = GitKey[];
export type AppKeys = AppKey[];
