export type Sender = "user" | "bot";

export enum StatusType {
  Clean = 0,
  Vulnerable = 1,
  Running = 2,
  Fixed = 3,
  FalsePositive = 4,
  Cancelled = 5,
}

export enum GitPlatformType {
  Github = 0,
  Gitlab = 1,
  Gitea = 2,
  Bitbucket = 3,
}

export enum SubscriptionPlanType {
  Free = 0,
}

export enum MessageStatusType {
  Queue = 0,
  Connecting = 1,
  WaitingForClient = 2,
  Scanning = 3,
  Finished = 4,
  Error = 5,
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
  id: string;
  message: string;
  sender: Sender;
  date: Date;
}

export interface GitKey {
  id: string;
  key: string | null;
  platform: GitPlatformType;
  date: Date;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlanType;
  endDate: Date;
}

export interface Message {
  status: MessageStatusType;
  message: string;
  repository: Repository;
}

export const subscriptionPlanToStr = (
  plan: SubscriptionPlanType | undefined
) => {
  switch (plan) {
    case SubscriptionPlanType.Free:
      return "Free";
    default:
      return "Unknown";
  }
};

export const GitPlatformToStr = (platform: GitPlatformType) => {
  switch (platform) {
    case GitPlatformType.Github:
      return "GitHub";
    case GitPlatformType.Gitlab:
      return "GitLab";
    case GitPlatformType.Gitea:
      return "Gitea";
    case GitPlatformType.Bitbucket:
      return "Bitbucket";
    default:
      return "Unknown";
  }
};

export type Repositories = Repository[];
export type Files = File[];
export type Codes = Code[];
export type ChatMessages = ChatMessage[];
export type GitKeys = GitKey[];
