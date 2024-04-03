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

export enum ApiPlatformType {
  Colab = 0,
  Kaggle = 1,
  GPT = 2,
  Perplexity = 3,
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
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

export interface ApiKey {
  id: number;
  key: string | null;
  platform: ApiPlatformType;
  date: Date;
}

export type Repositories = Repository[];
export type Files = File[];
export type Codes = Code[];
export type ChatMessages = ChatMessage[];
export type GitKeys = GitKey[];
export type ApiKeys = ApiKey[];
