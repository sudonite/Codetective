import { helix } from "ldrs";
import { FaCheckCircle } from "react-icons/fa";
import { SiGithub, SiGitlab, SiGitea, SiBitbucket } from "react-icons/si";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { delay, cn } from "@/Utils";

helix.register();

interface AnalyzeProps {
  start: boolean;
  progress: { actual: number; total: number };
  onProgress: (progress: { actual: number; total: number }) => void;
  status: "not_started" | "started" | "finished";
  onStatus: (status: "not_started" | "started" | "finished") => void;
}

const Title = ({
  start,
  status,
}: {
  start: boolean;
  status: "not_started" | "started" | "finished";
}) => {
  switch (status) {
    case "finished":
      return "Repository Analyzed";
    case "started":
      return "Analyzing Repository";
    case "not_started":
      if (start) return "Select Repository";
      else return "Waiting for Model";
  }
};

const Analyze = ({
  start,
  progress,
  onProgress,
  status,
  onStatus,
}: AnalyzeProps) => {
  const totalReceived = (): boolean => (progress.total ? true : false);

  const handleStatus = async () => {
    const total = 973;
    onStatus("started");
    await delay(5000);
    for (let i = 0; i < total; i++) {
      await delay(10);
      onProgress({ actual: i + 1, total: total });
    }
    onStatus("finished");
  };

  return (
    <div className="h-full w-1/4 flex flex-col">
      <div className="h-10">
        <h4 className="text-center scroll-m-20 text-xl font-semibold tracking-tight">
          <Title start={start} status={status} />
        </h4>
      </div>
      <div className="h-6">
        <p className="text-center text-sm text-muted-foreground">
          {status === "started" ? (
            totalReceived() ? (
              <>
                {"Analyzing function "}
                <strong>{progress.actual}</strong>
                {" of "}
                <strong>{progress.total}</strong>
              </>
            ) : (
              "This may take a few minutes"
            )
          ) : (
            ""
          )}
        </p>
      </div>
      <div className="h-full flex items-center justify-center">
        {status === "finished" ? (
          <FaCheckCircle className="text-primary h-32 w-32" />
        ) : status === "started" ? (
          <l-helix size={200} speed={2.5} color="hsl(var(--primary))"></l-helix>
        ) : (
          <div className="h-full w-full mx-4 flex flex-col items-center justify-between">
            <div className="flex flex-row h-2/4 w-full items-center justify-around">
              <SiGithub
                className={cn(
                  "w-14 h-14",
                  start ? "text-primary" : "text-primary/50"
                )}
              />
              <SiGitlab
                className={cn(
                  "w-14 h-14",
                  start ? "text-primary" : "text-primary/50"
                )}
              />
              <SiGitea
                className={cn(
                  "w-14 h-14",
                  start ? "text-destructive" : "text-destructive/50"
                )}
              />
              <SiBitbucket
                className={cn(
                  "w-14 h-14",
                  start ? "text-primary" : "text-primary/50"
                )}
              />
            </div>
            <Input disabled={!start} placeholder="Repository Web URL or SSH" />
            <Button
              onClick={() => handleStatus()}
              disabled={!start}
              className="w-full mb-2"
            >
              Check Repository
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
