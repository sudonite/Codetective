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
      // Update the status of the selected code
      const newCode = { ...selectedCode, status: status };
      const newCodes = codes.map(code =>
        code.id === selectedCode?.id ? newCode : code
      );
      setSelectedCode(newCode);
      setCodes(newCodes);

      // Update the status of the selected file
      if (!selectedFile) return;
      let fileStatus = selectedFile.status;
      const fileVulnerable = newCodes.some(
        code => code.status === "vulnerable"
      );

      const fileFalse = newCodes.every(code => code.status === "false");

      if (fileVulnerable) {
        fileStatus = "vulnerable";
      } else if (fileFalse) {
        fileStatus = "false";
      } else {
        fileStatus = "fixed";
      }

      const newFile = { ...selectedFile, status: fileStatus };
      const newFiles = files.map(file =>
        file.id === selectedFile?.id ? newFile : file
      );

      setSelectedFile(newFile);
      setFiles(newFiles);

      // Update the status of the selected repository
      if (!selectedRepository) return;
      let repositoryStatus = selectedRepository.status;
      const repositoryVulnerable = newFiles.some(
        file => file.status === "vulnerable"
      );

      const repositoryFalse = newFiles.every(file => file.status === "false");

      if (repositoryVulnerable) {
        repositoryStatus = "vulnerable";
      } else if (repositoryFalse) {
        repositoryStatus = "false";
      } else {
        repositoryStatus = "fixed";
      }

      const newRepository = { ...selectedRepository, status: repositoryStatus };
      const newRepositories = repositories.map(repository =>
        repository.id === selectedRepository?.id ? newRepository : repository
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
