import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Code,
  Codes,
  File,
  Files,
  Repositories,
  Repository,
  StatusType,
} from "@/Types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const generateRandomDate = () => {
  return new Date(
    Date.now() + Math.floor(Math.random() * (365 * 24 * 60 * 60 * 1000))
  );
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
  status: StatusType
): [Code, Codes] => {
  const newCode = { ...code, status: status };
  const newCodes = codes.map(c => (c.id === code?.id ? newCode : c));
  return [newCode, newCodes];
};

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * @TODO Refactor to generic function
 */

export const updateFileStatus = (
  file: File,
  files: Files,
  codes: Codes
): [File, Files] => {
  let fileStatus = file.status;
  const fileVulnerable = codes.some(c => c.status === StatusType.Vulnerable);
  const fileFalse = codes.every(c => c.status === StatusType.FalsePositive);

  if (fileVulnerable) {
    fileStatus = StatusType.Vulnerable;
  } else if (fileFalse) {
    fileStatus = StatusType.FalsePositive;
  } else {
    fileStatus = StatusType.Fixed;
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
  const repositoryVulnerable = files.some(
    f => f.status === StatusType.Vulnerable
  );
  const repositoryFalse = files.every(
    f => f.status === StatusType.FalsePositive
  );

  if (repositoryVulnerable) {
    repositoryStatus = StatusType.Vulnerable;
  } else if (repositoryFalse) {
    repositoryStatus = StatusType.FalsePositive;
  } else {
    repositoryStatus = StatusType.Fixed;
  }

  const newRepository = { ...repository, status: repositoryStatus };
  const newRepositories = repositories.map(r =>
    r.id === repository?.id ? newRepository : r
  );
  return [newRepository, newRepositories];
};
