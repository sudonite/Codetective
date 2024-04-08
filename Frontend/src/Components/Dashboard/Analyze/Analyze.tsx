import { useState, useEffect } from "react";

import { helix } from "ldrs";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { SiGithub, SiGitlab, SiGitea, SiBitbucket } from "react-icons/si";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { cn } from "@/Utils";

helix.register();

interface AnalyzeProps {
  start: boolean;
  scanning: boolean;
  progress: string;
  finished: boolean;
  onClick: (data: { [key: string]: string }) => void;
}

const Analyze = ({
  start,
  scanning,
  progress,
  finished,
  onClick,
}: AnalyzeProps) => {
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (scanning) setLoading(false);
  }, [scanning]);

  return (
    <div className="h-full w-1/4 flex flex-col">
      <div className="h-10">
        <h4 className="text-center scroll-m-20 text-xl font-semibold tracking-tight">
          {finished
            ? "Repository Analyzed"
            : start
            ? "Analyzing Repository"
            : "Waiting for Model"}
        </h4>
      </div>
      <div className="h-6">
        <p className="text-center text-sm text-muted-foreground">{progress}</p>
      </div>
      <div className="h-full flex items-center justify-center">
        {finished ? (
          <FaCheckCircle className="text-primary h-32 w-32" />
        ) : scanning ? (
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
            <Input
              id="link"
              value={link}
              onChange={e => setLink(e.target.value)}
              type="text"
              disabled={!start || loading}
              placeholder="Repository or SSH Link"
            />
            <Button
              onClick={() => {
                setLoading(true);
                onClick({ link: link });
              }}
              disabled={!start || link == "" || loading}
              className="w-full mb-2"
            >
              {loading ? (
                <>
                  <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Analyzing
                </>
              ) : (
                "Check Repository"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
