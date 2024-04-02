export type AppPlatform = "colab" | "kaggle" | "gpt" | "perplexity";
export type Sender = "user" | "bot";

export enum StatusType {
  Clean = 0,
  Vulnerable = 1,
  Running = 2,
  Fixed = 3,
  FalsePositive = 4,
}

export enum GitPlatformType {
  Github = 0,
  Gitlab = 1,
  Gitea = 2,
  Bitbucket = 3,
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  status: StatusType;
  platform: GitPlatformType;
  date: Date;
}

export interface File {
  id: string;
  name: string;
  path: string;
  extension: string;
  status: StatusType;
  date: Date;
}

export interface Code {
  id: string;
  lineStart: number;
  code: string;
  status: StatusType;
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
  platform: GitPlatformType;
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
