import { ChatMessage } from "@/Types";

const chatMessage: ChatMessage = {
  id: "1",
  message:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  sender: "bot",
  date: new Date(),
};

export const receiveAnswer = () => {
  return { data: chatMessage, status: 200 };
};
