import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Codes, File } from "@/Types";
import { codeTheme } from "@/Consts";
import { LuFileDigit, LuWrapText } from "react-icons/lu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/UI/Pagination";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/UI/Tooltip";

import { Toggle } from "@/Components/UI/Toggle";
import { ScrollArea, ScrollBar } from "@/Components/UI/ScrollArea";
import { cn } from "@/Utils";

interface CodeAreaProps {
  codes: Codes;
  file: File | null;
}

const CodeArea = ({ codes, file }: CodeAreaProps) => {
  const [selectedCodeID, setSelectedCodeID] = useState<number>(1);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);

  const handleCodeChange = (step: "prev" | "next") => {
    console.log(selectedCodeID);
    if (step === "prev") {
      if (selectedCodeID > 1) {
        setSelectedCodeID(selectedCodeID - 1);
      }
    } else if (step === "next") {
      if (selectedCodeID < codes.length) {
        setSelectedCodeID(selectedCodeID + 1);
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
        <div className="space-x-2 mr-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Toggle
                  variant="outline"
                  className="h-10 w-10"
                  defaultPressed={lineNumbers}
                  onPressedChange={() => setLineNumbers(!lineNumbers)}
                >
                  <LuFileDigit className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Line numbers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Toggle
                  variant="outline"
                  className="h-10 w-10"
                  defaultPressed={wordWrap}
                  onPressedChange={() => setWordWrap(!wordWrap)}
                >
                  <LuWrapText className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Word wrap</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="grow">
        {codes.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Select file
            </h3>
          </div>
        ) : (
          <ScrollArea className="w-full h-full rounded-lg">
            <SyntaxHighlighter
              wrapLongLines={wordWrap}
              showLineNumbers={lineNumbers}
              startingLineNumber={codes?.[0]?.lineStart}
              language="cpp"
              style={codeTheme as { [key: string]: React.CSSProperties }}
            >
              {codes?.[selectedCodeID - 1]?.code}
            </SyntaxHighlighter>
            <ScrollBar orientation="horizontal" />
            <ScrollBar />
          </ScrollArea>
        )}
      </div>
      <div className="h-16 max-h-16 p-2 flex flex-row items-center border-t">
        {codes.length > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() => handleCodeChange("prev")}
                />
              </PaginationItem>
              {codes?.map((code, index) => (
                <PaginationItem key={code.id}>
                  <PaginationLink
                    className={cn(
                      "cursor-pointer",
                      `${
                        selectedCodeID === index + 1
                          ? "bg-primary/50 hover:bg-primary/50"
                          : ""
                      }`
                    )}
                    onClick={() => setSelectedCodeID(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={() => handleCodeChange("next")}
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
