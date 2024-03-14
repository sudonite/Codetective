import { useEffect, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Components/UI/Resizable";

import RepositoryArea from "@/Components/Dashboard/RepositoryArea";
import FileArea from "@/Components/Dashboard/FileArea";
import CodeArea from "@/Components/Dashboard/CodeArea";
import { Repositories, Repository, Files, File } from "@/Types";
import { getRepositories, getFiles } from "@/fakeAPI";

const Dashboard = () => {
  const [repositories, setRepositories] = useState<Repositories>([]);
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);

  const [files, setFiles] = useState<Files>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setRepositories(getRepositories());
  }, []);

  useEffect(() => {
    if (selectedRepository) {
      setFiles(getFiles(selectedRepository?.id));
    }
  }, [selectedRepository]);

  const handleRepositoryChange = (repository: Repository) => {
    setSelectedRepository(repository);
    setSelectedFile(null);
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="border rounded-lg">
        <ResizablePanel defaultSize={25}>
          <RepositoryArea
            repositories={repositories}
            selectedRepository={selectedRepository}
            onClick={handleRepositoryChange}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={20} defaultSize={25}>
          <FileArea
            files={files}
            selectedFile={selectedFile}
            onClick={handleFileChange}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={50} defaultSize={50}>
          <CodeArea />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;
