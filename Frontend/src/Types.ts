export type Status = "clean" | "vulnerable" | "running";
export type Platform = "github" | "gitlab" | "gitea" | "bitbucket";

export interface Repository {
  id: number;
  name: string;
  url: string;
  status: Status;
  platform: Platform;
  date: Date;
}

export interface File {
  id: number;
  file: string;
  path: string;
  extension: string;
  date: Date;
}

export interface Code {
  id: number;
  lineStart: number;
  code: string;
  date: Date;
}

export type Repositories = Repository[];
export type Files = File[];
export type Codes = Code[];
