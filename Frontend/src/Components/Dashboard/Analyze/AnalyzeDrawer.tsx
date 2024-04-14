import { useState, useRef } from "react";
import { FaShieldHalved } from "react-icons/fa6";
import { WS } from "@/Consts";
import { Drawer, DrawerContent, DrawerTrigger } from "@/Components/UI/Drawer";
import { Button } from "@/Components/UI/Button";

import Server from "@/Components/Dashboard/Analyze/Server";
import Queue from "@/Components/Dashboard/Analyze/Queue";
import Model from "@/Components/Dashboard/Analyze/Model";
import Analyze from "@/Components/Dashboard/Analyze/Analyze";
import { GitPlatformType, Message, MessageStatusType } from "@/Types";

const AnalyzeDrawer = () => {
  const connection = useRef<WebSocket | null>(null);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [serverConnected, setServerConnected] = useState<boolean>(false);

  const [queuePosition, setQueuePosition] = useState<string>("");
  const [queueFinished, setQueueFinished] = useState<boolean>(false);

  const [modelConnected, setModelConnected] = useState<boolean>(false);

  const [scanStarted, setScanStarted] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<string>("");
  const [scanFinished, setScanFinished] = useState<boolean>(false);
  const [scanError, setScanError] = useState<boolean>(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    const ws = new WebSocket(WS + "?token=" + token);

    ws.onopen = () => console.log("Connected");
    ws.onclose = () => console.log("Disconnected");
    ws.onerror = error => console.log("Error: ", error);
    ws.onmessage = event => handleMessageReceive(event.data);

    connection.current = ws;
  };
  const handleDrawerClose = () => {
    connection.current?.close();
    setDrawerOpen(false);
    handleReset();
  };

  const handleServerConnected = () => setServerConnected(true);
  const handleQueuePosition = (position: string) => setQueuePosition(position);
  const handleQueueFinished = () => setQueueFinished(true);
  const handleModelConnected = () => setModelConnected(true);
  const handleScanStarted = () => setScanStarted(true);
  const handleScanProgress = (progress: string) => setScanProgress(progress);
  const handleScanFinished = () => {
    setScanFinished(true);
    setScanProgress("");
  };
  const handleError = () => setScanError(true);

  const handleMessageReceive = (data: string) => {
    const msg: Message = JSON.parse(data);
    switch (msg.status) {
      case MessageStatusType.Queue:
        handleServerConnected();
        handleQueuePosition(msg.message);
        break;
      case MessageStatusType.Connecting:
        handleServerConnected();
        handleQueueFinished();
        break;
      case MessageStatusType.WaitingForClient:
        handleServerConnected();
        handleQueueFinished();
        handleModelConnected();
        handleScanProgress(msg.message);
        break;
      case MessageStatusType.Scanning:
        handleServerConnected();
        handleQueueFinished();
        handleModelConnected();
        handleScanStarted();
        handleScanProgress(msg.message);
        break;
      case MessageStatusType.Finished:
        handleServerConnected();
        handleQueueFinished();
        handleModelConnected();
        handleScanFinished();
        break;
      case MessageStatusType.Error:
        handleServerConnected();
        handleQueueFinished();
        handleModelConnected();
        handleScanProgress(msg.message);
        handleError();
        break;
    }
  };

  const handleMessageSend = (data: { [key: string]: any }) => {
    connection.current?.send(JSON.stringify(data));
    handleScanStarted();
  };

  const handleStartAction = (
    link: string,
    platform: GitPlatformType,
    priv: boolean
  ) => {
    handleMessageSend({
      action: "start",
      link,
      platform,
      priv,
    });
  };
  const handleRetryAction = () => {
    handleMessageSend({ action: "retry" });
    setScanProgress("");
    setScanStarted(false);
    setScanFinished(false);
    setScanError(false);
  };
  const handleCancelAction = () => {
    handleMessageSend({ action: "cancel" });
    handleDrawerClose();
  };

  const handleReset = () => {
    setServerConnected(false);
    setQueuePosition("");
    setQueueFinished(false);
    setModelConnected(false);
    setScanStarted(false);
    setScanProgress("");
    setScanFinished(false);
    setScanError(false);
  };

  return (
    <Drawer
      open={drawerOpen}
      onOpenChange={open => !open && handleDrawerClose()}
    >
      <DrawerTrigger asChild>
        <Button variant="secondary" onClick={handleDrawerOpen}>
          <FaShieldHalved className="mr-2 w-4 h-4" />
          Scan Code
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[400px]">
        <div className="flex flex-row h-full">
          <Server finished={serverConnected} />
          <Queue
            start={serverConnected}
            position={queuePosition}
            finished={queueFinished}
          />
          <Model start={queueFinished} finished={modelConnected} />
          <Analyze
            start={modelConnected}
            scanning={scanStarted}
            progress={scanProgress}
            finished={scanFinished}
            error={scanError}
            onStart={handleStartAction}
            onRetry={handleRetryAction}
            onCancel={handleCancelAction}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default AnalyzeDrawer;
