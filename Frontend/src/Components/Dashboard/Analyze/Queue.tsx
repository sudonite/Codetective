import { useEffect } from "react";
import { hourglass } from "ldrs";
import { FaCheckCircle } from "react-icons/fa";
import { delay } from "@/Utils";

hourglass.register();

interface QueueProps {
  start: boolean;
  position: number;
  onPosition: (position: number) => void;
  finished: boolean;
  onFinished: () => void;
}

const Subtitle = ({ position }: { position: number }) => {
  return (
    <>
      You are currently number <strong>{position}</strong> in line
    </>
  );
};

const Queue = ({
  start,
  position,
  onPosition,
  finished,
  onFinished,
}: QueueProps) => {
  useEffect(() => {
    if (!start) return;
    (async () => {
      onPosition(3);
      await delay(3000);
      onPosition(2);
      await delay(3000);
      onPosition(1);
      await delay(3000);
      onPosition(0);
      await delay(1000);
      onFinished();
    })();
  }, [start]);

  return (
    <div className="h-full w-1/4 flex flex-col">
      <div className="h-10">
        <h4 className="text-center scroll-m-20 text-xl font-semibold tracking-tight">
          {finished
            ? "Queue Finished"
            : start
            ? "Waiting in Queue"
            : "Waiting for Server"}
        </h4>
      </div>
      <div className="h-6">
        <p className="text-center text-sm text-muted-foreground">
          {start && !finished ? <Subtitle position={position} /> : ""}
        </p>
      </div>
      <div className="h-full flex items-center justify-center">
        {finished ? (
          <FaCheckCircle className="text-primary h-32 w-32" />
        ) : (
          <l-hourglass
            size={200}
            bg-opacity={0.1}
            speed={1.75}
            color={start ? "hsl(var(--primary))" : "hsl(var(--primary) / 50%)"}
          ></l-hourglass>
        )}
      </div>
    </div>
  );
};

export default Queue;
