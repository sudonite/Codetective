import { useEffect, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Components/UI/Resizable";

import RepositoryArea from "@/Components/Dashboard/RepositoryArea";
import FileArea from "@/Components/Dashboard/FileArea";
import CodeArea from "@/Components/Dashboard/CodeArea";
import {
  Repositories,
  Repository,
  Files,
  File,
  Codes,
  Status,
  Code,
} from "@/Types";
import {
  updateCodeStatus,
  updateFileStatus,
  updateRepositoryStatus,
} from "@/Utils";
import { getRepositories, getFiles, getCodes, changeStatus } from "@/fakeAPI";

const Dashboard = () => {
  const [repositories, setRepositories] = useState<Repositories>([]);
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);

  const [files, setFiles] = useState<Files>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [codes, setCodes] = useState<Codes>([]);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);

  useEffect(() => {
    const response = getRepositories();
    if (response?.status === 200) {
      setRepositories(response?.data);
    }
  }, []);

  const handleSelectRepository = (repository: Repository) => {
    const response = getFiles(repository.id);
    if (response?.status === 200) {
      setSelectedRepository(repository);
      setFiles(response?.data);
      setSelectedFile(null);
      setCodes([]);
      setSelectedCode(null);
    }
  };

  const handleSelectFile = (file: File) => {
    const response = getCodes(file.id);
    if (response?.status === 200) {
      setSelectedFile(file);
      setCodes(response?.data);
      setSelectedCode(response?.data?.[0]);
    }
  };

  const handleSelectCode = (code: Code) => {
    setSelectedCode(code);
  };

  const handleStatusChange = (status: Status) => {
    if (!selectedCode) return;
    const response = changeStatus(selectedCode.id, status);
    if (response?.status === 200) {
      const [newCode, newCodes] = updateCodeStatus(selectedCode, codes, status);
      setSelectedCode(newCode);
      setCodes(newCodes);

      if (!selectedFile) return;
      const [newFile, newFiles] = updateFileStatus(
        selectedFile,
        files,
        newCodes
      );
      setSelectedFile(newFile);
      setFiles(newFiles);

      if (!selectedRepository) return;
      const [newRepository, newRepositories] = updateRepositoryStatus(
        selectedRepository,
        repositories,
        newFiles
      );
      setSelectedRepository(newRepository);
      setRepositories(newRepositories);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="border rounded-lg">
        <ResizablePanel defaultSize={25}>
          <RepositoryArea
            repositories={repositories}
            selectedRepository={selectedRepository}
            onClick={handleSelectRepository}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={20} defaultSize={25}>
          <FileArea
            files={files}
            selectedFile={selectedFile}
            onClick={handleSelectFile}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={50} defaultSize={50}>
          <CodeArea
            file={selectedFile}
            codes={codes}
            selectedCode={selectedCode}
            onCodeChange={handleSelectCode}
            onStatusChange={handleStatusChange}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;
