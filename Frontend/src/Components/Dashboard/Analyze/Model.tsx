import { grid } from "ldrs";
import { FaCheckCircle } from "react-icons/fa";

grid.register();

interface ModelProps {
  start: boolean;
  finished: boolean;
}

const Model = ({ start, finished }: ModelProps) => {
  return (
    <div className="h-full w-1/4 flex flex-col">
      <div className="h-10">
        <h4 className="text-center scroll-m-20 text-xl font-semibold tracking-tight">
          {finished
            ? "Connected to Model"
            : start
            ? "Connecting to Model"
            : "Waiting for Queue"}
        </h4>
      </div>
      <div className="h-6"></div>
      <div className="h-full flex items-center justify-center">
        {finished ? (
          <FaCheckCircle className="text-primary h-32 w-32" />
        ) : (
          <l-grid
            size={200}
            speed={1.8}
            color={start ? "hsl(var(--primary))" : "hsl(var(--primary) / 50%)"}
          ></l-grid>
        )}
      </div>
    </div>
  );
};

export default Model;
