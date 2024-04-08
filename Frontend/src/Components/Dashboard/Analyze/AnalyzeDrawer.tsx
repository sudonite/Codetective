import { useState, useRef } from "react";
import { FaShieldHalved } from "react-icons/fa6";
import { WS } from "@/Consts";
import { Drawer, DrawerContent, DrawerTrigger } from "@/Components/UI/Drawer";
import { Button } from "@/Components/UI/Button";

import Server from "@/Components/Dashboard/Analyze/Server";
import Queue from "@/Components/Dashboard/Analyze/Queue";
import Model from "@/Components/Dashboard/Analyze/Model";
import Analyze from "@/Components/Dashboard/Analyze/Analyze";
import { Message, MessageStatusType } from "@/Types";

const AnalyzeDrawer = () => {
  const connection = useRef<WebSocket | null>(null);

  const [serverConnected, setServerConnected] = useState<boolean>(false);

  const [queuePosition, setQueuePosition] = useState<string>("");
  const [queueFinished, setQueueFinished] = useState<boolean>(false);

  const [modelConnected, setModelConnected] = useState<boolean>(false);

  const [scanStarted, setScanStarted] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<string>("");
  const [scanFinished, setScanFinished] = useState<boolean>(false);

  const handleDrawer = (open: boolean) => {
    if (open) handleDrawerOpen();
    else handleDrawerClose();
  };

  const handleDrawerOpen = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    const ws = new WebSocket(WS + "?token=" + token);

    ws.onopen = () => handleServerConnected();
    ws.onclose = () => console.log("Disconnected");
    ws.onerror = error => console.log("Error: ", error);
    ws.onmessage = event => handleMessageReceive(event.data);

    connection.current = ws;
  };
  const handleDrawerClose = () => {
    handleReset();
    connection.current?.close();
  };

  const handleServerConnected = () => setServerConnected(true);
  const handleQueuePosition = (position: string) => setQueuePosition(position);
  const handleQueueFinished = () => setQueueFinished(true);
  const handleModelConnected = () => setModelConnected(true);
  const handleScanStarted = () => setScanStarted(true);
  const handleScanProgress = (progress: string) => setScanProgress(progress);
  const handleFinished = () => {
    setScanFinished(true);
    setScanProgress("");
  };

  const handleMessageReceive = (data: string) => {
    const msg: Message = JSON.parse(data);
    switch (msg.status) {
      case MessageStatusType.Queue:
        handleQueuePosition(msg.message);
        break;
      case MessageStatusType.Connecting:
        handleQueueFinished();
        break;
      case MessageStatusType.WaitingForClient:
        handleQueueFinished();
        handleModelConnected();
        break;
      case MessageStatusType.Scanning:
        handleQueueFinished();
        handleModelConnected();
        handleScanStarted();
        handleScanProgress(msg.message);
        break;
      case MessageStatusType.Finished:
        handleFinished();
        break;
    }
  };

  const handleMessageSend = (data: { [key: string]: string }) => {
    connection.current?.send(JSON.stringify(data));
  };

  const handleReset = () => {
    setServerConnected(false);
    setQueuePosition("");
    setQueueFinished(false);
    setModelConnected(false);
    setScanStarted(false);
    setScanProgress("");
    setScanFinished(false);
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
            onClick={handleMessageSend}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default AnalyzeDrawer;
