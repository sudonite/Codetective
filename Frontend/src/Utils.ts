import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Code,
  Codes,
  File,
  Files,
  Repositories,
  Repository,
  Status,
} from "@/Types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDate = (input: string | number): string => {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const updateCodeStatus = (
  code: Code,
  codes: Codes,
  status: Status
): [Code, Codes] => {
  const newCode = { ...code, status: status };
  const newCodes = codes.map(c => (c.id === code?.id ? newCode : c));
  return [newCode, newCodes];
};

/**
 * @TODO Refactor to generic function
 */

export const updateFileStatus = (
  file: File,
  files: Files,
  codes: Codes
): [File, Files] => {
  let fileStatus = file.status;
  const fileVulnerable = codes.some(c => c.status === "vulnerable");
  const fileFalse = codes.every(c => c.status === "false");

  if (fileVulnerable) {
    fileStatus = "vulnerable";
  } else if (fileFalse) {
    fileStatus = "false";
  } else {
    fileStatus = "fixed";
  }

  const newFile = { ...file, status: fileStatus };
  const newFiles = files.map(f => (f.id === file?.id ? newFile : f));
  return [newFile, newFiles];
};

export const updateRepositoryStatus = (
  repository: Repository,
  repositories: Repositories,
  files: Files
): [Repository, Repositories] => {
  let repositoryStatus = repository.status;
  const repositoryVulnerable = files.some(f => f.status === "vulnerable");
  const repositoryFalse = files.every(f => f.status === "false");

  if (repositoryVulnerable) {
    repositoryStatus = "vulnerable";
  } else if (repositoryFalse) {
    repositoryStatus = "false";
  } else {
    repositoryStatus = "fixed";
  }

  const newRepository = { ...repository, status: repositoryStatus };
  const newRepositories = repositories.map(r =>
    r.id === repository?.id ? newRepository : r
  );
  return [newRepository, newRepositories];
};
