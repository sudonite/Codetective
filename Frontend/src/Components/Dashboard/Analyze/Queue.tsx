import { hourglass } from "ldrs";
import { FaCheckCircle } from "react-icons/fa";

hourglass.register();

interface QueueProps {
  start: boolean;
  position: string;
  finished: boolean;
}

const Queue = ({ start, position, finished }: QueueProps) => {
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
          {start && !finished ? position : ""}
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
