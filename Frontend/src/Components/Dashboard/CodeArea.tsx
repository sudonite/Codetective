import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Codes, File, StatusType, Code, Repository } from "@/Types";
import { codeTheme } from "@/Consts";

import { Button } from "@/Components/UI/Button";
import { ScrollArea, ScrollBar } from "@/Components/UI/ScrollArea";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import CodeDropdown from "@/Components/Dashboard/CodeDropdown";

interface CodeAreaProps {
  codes: Codes;
  file: File | null;
  repository: Repository | null;
  selectedCode: Code | null;
  onCodeChange: (code: Code) => void;
  onStatusChange: (status: StatusType) => void;
}

const CodeArea = ({
  codes,
  file,
  repository,
  selectedCode,
  onCodeChange,
  onStatusChange,
}: CodeAreaProps) => {
  const [lineNumbers, setLineNumbers] = useState<boolean>(true);
  const [wordWrap, setWordWrap] = useState<boolean>(false);

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
      <div className="min-h-16 max-h-16 p-2 flex flex-row gap-x-2 items-center border-b justify-between">
        <div>
          {selectedCode && (
            <h1 className="text-center">
              <div className="ml-3 grow flex flex-row justify-start items-center">
                <code className="relative rounded bg-muted px-[0.5rem] py-[0.1rem] font-mono text-lg font-semibold">
                  {file ? `${file?.path}/${file?.name}${file?.extension}` : ""}
                </code>
              </div>
            </h1>
          )}
        </div>
        <CodeDropdown
          repository={repository}
          selectedCode={selectedCode}
          wordWrap={wordWrap}
          lineNumbers={lineNumbers}
          setWordWrap={setWordWrap}
          setLineNumbers={setLineNumbers}
          onStatusChange={onStatusChange}
        />
      </div>
      <div className="grow h-full">
        {selectedCode ? (
          <ScrollArea className="w-full h-[calc(100vh-128px)] rounded-lg">
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
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Select a file
            </h3>
          </div>
        )}
      </div>
      <div className="min-h-16 max-h-16 p-2 flex flex-row items-center border-t justify-between">
        {selectedCode && (
          <div className="flex flex-row w-full justify-start">
            <Button
              className="m-1"
              variant="secondary"
              size="icon"
              disabled={
                codes.findIndex(obj => obj.id == selectedCode?.id) === 0
              }
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
        )}
      </div>
    </div>
  );
};

export default CodeArea;
