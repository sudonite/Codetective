import { useState } from "react";
import { FaShieldHalved } from "react-icons/fa6";

import { Drawer, DrawerContent, DrawerTrigger } from "@/Components/UI/Drawer";
import { Button } from "@/Components/UI/Button";

import Server from "@/Components/Dashboard/Analyze/Server";
import Queue from "@/Components/Dashboard/Analyze/Queue";
import Model from "@/Components/Dashboard/Analyze/Model";
import Analyze from "@/Components/Dashboard/Analyze/Analyze";

const AnalyzeDrawer = () => {
  const [open, setOpen] = useState(false);

  const [serverConnected, setServerConnected] = useState<boolean>(false);

  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [queueFinished, setQueueFinished] = useState<boolean>(false);

  const [modelConnected, setModelConnected] = useState<boolean>(false);

  const [analyzeProgress, setAnalyzeProgress] = useState<{
    actual: number;
    total: number;
  }>({ actual: 0, total: 0 });
  const [analyzeStatus, setAnalyzeStatus] = useState<
    "not_started" | "started" | "finished"
  >("not_started");

  const handleDrawer = (open: boolean) => {
    if (open) handleDrawerOpen();
    else handleDrawerClose();
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => handleReset();

  const handleServerConnected = () => setServerConnected(true);
  const handleQueuePosition = (position: number) => setQueuePosition(position);
  const handleQueueFinished = () => setQueueFinished(true);

  const handleModelConnected = () => setModelConnected(true);

  const handleReset = () => {
    setOpen(false);
    setServerConnected(false);
    setQueuePosition(0);
    setQueueFinished(false);
    setModelConnected(false);
    setAnalyzeProgress({ actual: 0, total: 0 });
    setAnalyzeStatus("not_started");
  };

  return (
    <Drawer onOpenChange={handleDrawer}>
      <DrawerTrigger asChild>
        <Button variant="secondary">
          <FaShieldHalved className="mr-2 w-4 h-4" />
          Scan Code
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[400px]">
        <div className="flex flex-row h-full">
          <Server
            start={open}
            finished={serverConnected}
            onFinished={handleServerConnected}
          />
          <Queue
            start={serverConnected}
            position={queuePosition}
            onPosition={handleQueuePosition}
            finished={queueFinished}
            onFinished={handleQueueFinished}
          />
          <Model
            start={queueFinished}
            finished={modelConnected}
            onFinished={handleModelConnected}
          />
          <Analyze
            start={modelConnected}
            progress={analyzeProgress}
            onProgress={setAnalyzeProgress}
            status={analyzeStatus}
            onStatus={setAnalyzeStatus}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default AnalyzeDrawer;
