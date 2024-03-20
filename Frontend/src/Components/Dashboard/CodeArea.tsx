import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Codes, File, Status, Code } from "@/Types";
import { codeTheme } from "@/Consts";
import { IoMdSettings } from "react-icons/io";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/UI/Pagination";

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
} from "@/Components/UI/DropdownMenu";

import StatusBadge from "@/Components/Dashboard/StatusBadge";
import { Button } from "@/Components/UI/Button";
import { ScrollArea, ScrollBar } from "@/Components/UI/ScrollArea";
import { cn } from "@/Utils";

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
  console.log(file);
  const handlePagination = (step: "prev" | "next" | number) => {
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
            <h3 className="text-2xl font-semibold tracking-tight">
              {file ? `${file?.path}${file?.name}.${file?.extension}` : ""}
            </h3>
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
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Change status</span>
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
      <div className="h-16 max-h-16 p-2 flex flex-row items-center border-t justify-center">
        {codes.length > 1 && (
          <Pagination className="flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() => handlePagination("prev")}
                />
              </PaginationItem>
              {codes?.map((code, index) => (
                <PaginationItem key={code.id}>
                  <PaginationLink
                    className={cn(
                      "cursor-pointer",
                      `${
                        selectedCode?.id === code?.id
                          ? "bg-primary/50 hover:bg-primary/50"
                          : ""
                      }`
                    )}
                    onClick={() => handlePagination(code?.id)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={() => handlePagination("next")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default CodeArea;
