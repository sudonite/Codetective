import { useState, useEffect, useMemo } from "react";

import { helix } from "ldrs";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";
import { SiGithub, SiGitlab, SiGitea, SiBitbucket } from "react-icons/si";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { Switch } from "@/Components/UI/Switch";
import { Label } from "@/Components/UI/Label";
import { cn } from "@/Utils";
import { useProfile } from "@/Contexts/ProfileContext";
import { GitKeys, GitPlatformType } from "@/Types";
import { capitalizeFirstLetter } from "@/Utils";

helix.register();

interface AnalyzeProps {
  start: boolean;
  scanning: boolean;
  progress: string;
  finished: boolean;
  error: boolean;
  onStart: (link: string, platform: GitPlatformType, priv: boolean) => void;
  onRetry: () => void;
  onCancel: () => void;
}

interface PlatformCardProps {
  platform: GitPlatformType;
  start: boolean;
  loading: boolean;
  connected: boolean;
  privRepo: boolean;
  selected: GitPlatformType | null;
  onClick: (platform: GitPlatformType) => void;
}

const PlatformCard = ({
  platform,
  start,
  loading,
  connected,
  privRepo,
  selected,
  onClick,
}: PlatformCardProps) => {
  const classNames = cn(
    "w-24 h-24 border rounded-lg p-4",
    start && !loading
      ? connected
        ? "text-primary"
        : "text-destructive"
      : connected
      ? "text-primary/50"
      : "text-destructive/50",
    selected === platform && "bg-accent border-primary",
    !connected && privRepo
      ? "cursor-not-allowed"
      : "hover:bg-accent hover:border-primary cursor-pointer"
  );
  switch (platform) {
    case GitPlatformType.Github:
      return (
        <SiGithub
          className={classNames}
          onClick={() => !(!connected && privRepo) && onClick(platform)}
        />
      );
    case GitPlatformType.Gitlab:
      return (
        <SiGitlab
          className={classNames}
          onClick={() => !(!connected && privRepo) && onClick(platform)}
        />
      );
    case GitPlatformType.Gitea:
      return (
        <SiGitea
          className={classNames}
          onClick={() => !(!connected && privRepo) && onClick(platform)}
        />
      );
    case GitPlatformType.Bitbucket:
      return (
        <SiBitbucket
          className={classNames}
          onClick={() => !(!connected && privRepo) && onClick(platform)}
        />
      );
  }
};

const Analyze = ({
  start,
  scanning,
  progress,
  finished,
  error,
  onStart,
  onRetry,
  onCancel,
}: AnalyzeProps) => {
  const { profile } = useProfile();
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [privateRepo, setPrivateRepo] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<GitPlatformType | null>(null);

  const gitConnected = (platform: GitPlatformType): boolean => {
    const keys = profile?.gitKeys as GitKeys;
    if (keys.find(key => key.platform === platform)?.key !== "") return true;
    return false;
  };
  const githubConnected = useMemo(
    () => gitConnected(GitPlatformType.Github),
    [profile?.gitKeys]
  );
  const gitlabConnected = useMemo(
    () => gitConnected(GitPlatformType.Gitlab),
    [profile?.gitKeys]
  );
  const giteaConnected = useMemo(
    () => gitConnected(GitPlatformType.Gitea),
    [profile?.gitKeys]
  );
  const bitbucketConnected = useMemo(
    () => gitConnected(GitPlatformType.Bitbucket),
    [profile?.gitKeys]
  );

  useEffect(() => {
    if (scanning) setLoading(false);
  }, [scanning]);

  return (
    <div className="h-full w-1/4 flex flex-col">
      <div className="h-10">
        <h4 className="text-center scroll-m-20 text-xl font-semibold tracking-tight">
          {error
            ? "Failed to Analyze Repository"
            : finished
            ? "Repository Analyzed"
            : start
            ? "Analyzing Repository"
            : "Waiting for Model"}
        </h4>
      </div>
      <div className="h-6">
        <p className="text-center text-sm text-muted-foreground">
          {scanning
            ? capitalizeFirstLetter(progress)
            : "Configure the repository to analyze"}
        </p>
      </div>
      <div className="h-full flex items-center justify-center">
        {finished && <FaCheckCircle className="text-primary h-32 w-32" />}
        {error && (
          <>
            <FaCircleXmark className="text-destructive h-32 w-32 relative" />
            <div className="fixed bottom-5 w-1/6 flex flex-row space-x-4">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
              <Button
                className="w-1/2"
                onClick={() => {
                  setLink("");
                  onRetry();
                }}
              >
                Retry
              </Button>
            </div>
          </>
        )}
        {scanning && !finished && !error && (
          <l-helix size={200} speed={2.5} color="hsl(var(--primary))"></l-helix>
        )}
        {!scanning && !finished && !error && (
          <div className="h-full w-full mx-4 flex flex-col items-center justify-evenly">
            <div className="flex flex-row w-full justify-between">
              <PlatformCard
                platform={GitPlatformType.Github}
                start={start}
                loading={loading}
                privRepo={privateRepo}
                connected={githubConnected}
                selected={selectedPlatform}
                onClick={setSelectedPlatform}
              />
              <PlatformCard
                platform={GitPlatformType.Gitlab}
                start={start}
                loading={loading}
                privRepo={privateRepo}
                connected={gitlabConnected}
                selected={selectedPlatform}
                onClick={setSelectedPlatform}
              />
              <PlatformCard
                platform={GitPlatformType.Gitea}
                start={start}
                privRepo={privateRepo}
                loading={loading}
                connected={giteaConnected}
                selected={selectedPlatform}
                onClick={setSelectedPlatform}
              />
              <PlatformCard
                platform={GitPlatformType.Bitbucket}
                start={start}
                privRepo={privateRepo}
                loading={loading}
                connected={bitbucketConnected}
                selected={selectedPlatform}
                onClick={setSelectedPlatform}
              />
            </div>
            <div className="w-full flex items-center space-x-2 rounded-lg border p-2">
              <Switch
                id="private"
                disabled={
                  !start ||
                  loading ||
                  selectedPlatform === null ||
                  (selectedPlatform !== null &&
                    profile?.gitKeys.find(
                      item => item.platform === selectedPlatform
                    )?.key === "")
                }
                checked={privateRepo}
                onCheckedChange={e => setPrivateRepo(e)}
              />
              <Label htmlFor="private">Private Repository</Label>
            </div>
            <Input
              id="link"
              value={link}
              onChange={e => setLink(e.target.value)}
              type="text"
              autoComplete="off"
              disabled={!start || loading || selectedPlatform === null}
              placeholder={privateRepo ? "SSH URL" : "HTTP or SSH URL"}
            />
            <Button
              onClick={() => {
                setLoading(true);
                onStart(link, selectedPlatform as GitPlatformType, privateRepo);
              }}
              disabled={
                !start || link == "" || loading || selectedPlatform === null
              }
              className="w-full"
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
