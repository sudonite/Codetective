import { useEffect, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Components/UI/Resizable";

import RepositoryArea from "@/Components/Dashboard/RepositoryArea";
import FileArea from "@/Components/Dashboard/FileArea";
import CodeArea from "@/Components/Dashboard/CodeArea";
import { Repositories, Repository } from "@/Types";
import { getRepositories } from "@/fakeAPI";

const Dashboard = () => {
  const [repositories, setRepositories] = useState<Repositories>([]);
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);

  useEffect(() => {
    setRepositories(getRepositories());
  }, []);

  useEffect(() => {
    console.log("Selected Repository: ", selectedRepository);
  }, [selectedRepository]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="border rounded-lg">
        <ResizablePanel defaultSize={25}>
          <RepositoryArea
            repositories={repositories}
            selectedRepository={selectedRepository}
            onClick={setSelectedRepository}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={20} defaultSize={25}>
          <FileArea />
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
