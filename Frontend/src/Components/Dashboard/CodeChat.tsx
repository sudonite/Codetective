import { TbRobot } from "react-icons/tb";
import { IoSend } from "react-icons/io5";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/UI/Dialog";
import { Button } from "@/Components/UI/Button";
import { ScrollArea } from "@/Components/UI/ScrollArea";
import { Input } from "@/Components/UI/Input";

import { ChatMessages } from "@/Types";
import { cn } from "@/Utils";

interface CodeChatProps {
  chatInput: string;
  chatMessages: ChatMessages;
  handleChat: () => void;
  setChatInput: (chatInput: string) => void;
}

const CodeChat = ({
  chatInput,
  chatMessages,
  handleChat,
  setChatInput,
}: CodeChatProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={chatInput.length < 1}
          onClick={() => handleChat()}
        >
          Send
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[50%] max-h-[75%]">
        <DialogHeader className="flex flex-row space-x-4">
          <div className="rounded-lg border bg-primary p-2">
            <TbRobot className="min-w-10 min-h-10" />
          </div>
          <div className="flex flex-col justify-around">
            <DialogTitle>AI Chat</DialogTitle>
            <DialogDescription>
              Ask anything, and let the power of AI guide you through an
              enlightening conversation.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="w-full h-full space-y-4">
          <ScrollArea className="h-96 border rounded-lg p-2">
            <div className="space-y-2">
              {chatMessages.map(message => (
                <div
                  className={cn(
                    "w-fit rounded-lg px-3 py-2 text-sm max-w-[60%]",
                    message.sender === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.message}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex flex-row space-x-2">
            <Input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask anything..."
            />
            <Button
              disabled={chatInput.length < 1}
              onClick={() => handleChat()}
            >
              <IoSend className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeChat;
