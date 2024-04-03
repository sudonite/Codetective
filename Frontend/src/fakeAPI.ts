import {
  ChatMessage,
  GitKeys,
  ApiKeys,
  GitPlatformType,
  ApiPlatformType,
} from "@/Types";
import { generateRandomDate } from "@/Utils";

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
    platform: GitPlatformType.Github,
    date: generateRandomDate(),
  },
  {
    id: 2,
    key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFlLnIKfwAj+weYn7hA81DBHmIa6Z8+UTYy1/2or6YIC sudonite@codetective",
    platform: GitPlatformType.Gitlab,
    date: generateRandomDate(),
  },
  {
    id: 3,
    key: null,
    platform: GitPlatformType.Gitea,
    date: generateRandomDate(),
  },
  {
    id: 4,
    key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBVPUbPfSuVA5BIu+4Uma1gW1eWPzBiHzslVWmVFZcK9 sudonite@codetective",
    platform: GitPlatformType.Bitbucket,
    date: generateRandomDate(),
  },
];

const appKeys: ApiKeys = [
  {
    id: 1,
    key: null,
    platform: ApiPlatformType.Colab,
    date: generateRandomDate(),
  },
  {
    id: 2,
    key: "35b997af-1644-4484-b456-f7dc1e1ebe3c",
    platform: ApiPlatformType.Kaggle,
    date: generateRandomDate(),
  },
  {
    id: 3,
    key: "19f20913-8712-4e52-a0f5-e11e0ac678bd",
    platform: ApiPlatformType.GPT,
    date: generateRandomDate(),
  },
  {
    id: 4,
    key: "5fae1c9b-5ee6-4835-8248-450ac0b7d5e9",
    platform: ApiPlatformType.Perplexity,
    date: generateRandomDate(),
  },
];

export const receiveAnswer = () => {
  return { data: chatMessage, status: 200 };
};

export const getGitKeys = (): { data: GitKeys; status: number } => {
  return { data: gitKeys, status: 200 };
};

export const getAppKeys = (): { data: ApiKeys; status: number } => {
  return { data: appKeys, status: 200 };
};
