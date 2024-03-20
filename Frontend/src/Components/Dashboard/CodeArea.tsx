import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Codes, File, Status, Code } from "@/Types";
import { codeTheme } from "@/Consts";
import { IoMdSettings } from "react-icons/io";
import { FaGit, FaShieldAlt } from "react-icons/fa";
import { TbBrandVscode } from "react-icons/tb";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/Components/UI/DropdownMenu";

import StatusBadge from "@/Components/Dashboard/StatusBadge";
import { Button } from "@/Components/UI/Button";
import { ScrollArea, ScrollBar } from "@/Components/UI/ScrollArea";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { Input } from "@/Components/UI/Input";

interface CodeAreaProps {
  codes: Codes;
  file: File | null;
  selectedCode: Code | null;
  onCodeChange: (code: Code) => void;
  onStatusChange: (status: Status) => void;
}

const CodeArea = ({
  codes,
  file,
  selectedCode,
  onCodeChange,
  onStatusChange,
}: CodeAreaProps) => {
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);

  const handleStepper = (step: "prev" | "next") => {
    if (selectedCode) {
      if (step === "prev") {
        const index = codes.findIndex(code => code.id === selectedCode.id);
        if (index > 0) {
          onCodeChange(codes[index - 1]);
        }
      } else if (step === "next") {
        const index = codes.findIndex(code => code.id === selectedCode.id);
        if (index < codes.length - 1) {
          onCodeChange(codes[index + 1]);
        }
      } else if (typeof step === "number") {
        const code = codes.find(code => code.id === step);
        if (code) onCodeChange(code);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col box-border">
      <div className="h-16 max-h-16 p-2 flex flex-row gap-x-2 items-center border-b justify-between">
        <h1 className="text-center">
          <div className="ml-3 grow flex flex-row justify-start items-center">
            <code className="relative rounded bg-muted px-[0.5rem] py-[0.1rem] font-mono text-lg font-semibold">
              {file ? `${file?.path}${file?.name}.${file?.extension}` : ""}
            </code>
          </div>
        </h1>
        {codes.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                className="flex items-center justify-between space-x-4"
              >
                <StatusBadge status={selectedCode?.status ?? null} />
                <IoMdSettings className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  <FaGit className="mr-2 h-4 w-4" />
                  Open repository
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <TbBrandVscode className="mr-2 h-4 w-4" />
                  Open in VSCode
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FaShieldAlt className="mr-2 h-4 w-4" />
                  Change status
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuCheckboxItem
                      onCheckedChange={() => onStatusChange("fixed")}
                      checked={selectedCode?.status === "fixed"}
                    >
                      <StatusBadge status="fixed" />
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onCheckedChange={() => onStatusChange("vulnerable")}
                      checked={selectedCode?.status === "vulnerable"}
                    >
                      <StatusBadge status="vulnerable" />
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onCheckedChange={() => onStatusChange("false")}
                      checked={selectedCode?.status === "false"}
                    >
                      <StatusBadge status="false" />
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={wordWrap}
                  onCheckedChange={() => setWordWrap(!wordWrap)}
                >
                  Word Wrap
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={lineNumbers}
                  onCheckedChange={() => setLineNumbers(!lineNumbers)}
                >
                  Line Numbers
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="grow">
        {selectedCode ? (
          <ScrollArea className="w-full h-full rounded-lg">
            {/* @TODO
                Fix WordWrap
            */}
            <SyntaxHighlighter
              wrapLongLines={wordWrap}
              showLineNumbers={lineNumbers}
              startingLineNumber={selectedCode?.lineStart}
              language="cpp"
              style={codeTheme as { [key: string]: React.CSSProperties }}
            >
              {selectedCode.code}
            </SyntaxHighlighter>
            <ScrollBar orientation="horizontal" />
            <ScrollBar />
          </ScrollArea>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Select a file
            </h3>
          </div>
        )}
      </div>
      <div className="h-16 max-h-16 p-2 flex flex-row items-center border-t justify-between">
        <div className="flex items-center w-1/2">
          <Button
            className="m-1"
            variant="secondary"
            size="icon"
            disabled={codes.findIndex(obj => obj.id == selectedCode?.id) === 0}
            onClick={() => handleStepper("prev")}
          >
            <RxChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            className="m-1"
            variant="secondary"
            size="icon"
            disabled={
              codes.findIndex(obj => obj.id == selectedCode?.id) ===
              codes.length - 1
            }
            onClick={() => handleStepper("next")}
          >
            <RxChevronRight className="h-6 w-6" />
          </Button>
          <div className="m-2 text-lg font-semibold">
            {`Code ${
              codes.findIndex(obj => obj.id == selectedCode?.id) + 1
            } of ${codes.length}`}
          </div>
        </div>
        <div className="flex items-center w-1/2 space-x-2">
          <Input
            disabled
            type="text"
            placeholder="Ask AI: Why is this code vulnerable? Explain..."
          />
          <Button disabled variant="outline">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeArea;
