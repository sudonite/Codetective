import { useState } from "react";

import { Files, File } from "@/Types";
import { cn } from "@/Utils";

import FileIcon from "@/Components/Dashboard/FileIcon";

import { Card } from "@/Components/UI/Card";
import { ScrollArea } from "@/Components/UI/ScrollArea";
import { Input } from "@/Components/UI/Input";

import { FaSearch } from "react-icons/fa";
import StatusBadge from "@/Components/Dashboard/StatusBadge";

interface FileAreaProps {
  files: Files;
  selectedFile: File | null;
  onClick: (file: File) => void;
}

const FileArea = ({ files, selectedFile, onClick }: FileAreaProps) => {
  const [searchedFilename, setSearchedFilename] = useState<string>("");

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 max-h-16 p-2 flex flex-row gap-x-2 items-center border-b relative">
        <FaSearch className="absolute left-4 top-6 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search file"
          className="pl-8 w-full"
          value={searchedFilename}
          onChange={e => setSearchedFilename(e.target.value)}
        />
      </div>
      <div className="grow">
        {files && files.length > 0 ? (
          <ScrollArea className="w-full h-[calc(100vh-8rem)] rounded-lg">
            {files
              .filter(file =>
                file.name.toLowerCase().includes(searchedFilename.toLowerCase())
              )
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(file => (
                <Card
                  key={file.id}
                  className={cn(
                    "m-4 p-2 cursor-pointer",
                    selectedFile?.id === file.id
                      ? "bg-primary/50 hover:bg-primary/50"
                      : "bg-secondary/50 hover:bg-primary/50"
                  )}
                  onClick={() => onClick(file)}
                >
                  <div className="flex flew-row justify-between items-center">
                    <div className="flex flex-row justify-start items-center gap-2">
                      <FileIcon extension={file.extension} />
                      <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
                        {file.name}.{file.extension}
                      </h4>
                    </div>
                    <StatusBadge status={file.status} />
                  </div>
                </Card>
              ))}
          </ScrollArea>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              No files found
            </h3>
          </div>
        )}
      </div>
      <div className="h-16 max-h-16 p-2 flex flex-row items-center justify-between border-t"></div>
    </div>
  );
};

export default FileArea;
