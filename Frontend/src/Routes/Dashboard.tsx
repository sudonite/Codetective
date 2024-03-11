import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Components/UI/Resizable";

import RepositoryArea from "@/Components/Dashboard/RepositoryArea";
import FileArea from "@/Components/Dashboard/FileArea";
import CodeArea from "@/Components/Dashboard/CodeArea";

const Dashboard = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="border rounded-lg">
        <ResizablePanel defaultSize={25}>
          <RepositoryArea />
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
