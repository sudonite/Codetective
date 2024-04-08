import { ripples } from "ldrs";
import { FaCheckCircle } from "react-icons/fa";

ripples.register();

interface ServerProps {
  finished: boolean;
}

const Server = ({ finished }: ServerProps) => {
  return (
    <div className="h-full w-1/4 flex flex-col">
      <div className="h-10">
        <h4 className="text-center scroll-m-20 text-xl font-semibold tracking-tight">
          {finished ? "Connected to Server" : "Connecting to Server"}
        </h4>
      </div>
      <div className="h-6"></div>
      <div className="h-full flex items-center justify-center">
        {finished ? (
          <FaCheckCircle className="text-primary h-32 w-32" />
        ) : (
          <l-ripples
            size={200}
            speed={4}
            color="hsl(var(--primary))"
          ></l-ripples>
        )}
      </div>
    </div>
  );
};

export default Server;
