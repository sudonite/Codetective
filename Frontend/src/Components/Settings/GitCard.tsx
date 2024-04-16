import { FaCopy, FaTrash, FaQuestionCircle } from "react-icons/fa";
import { FaArrowsRotate, FaArrowRotateLeft } from "react-icons/fa6";
import { SiGithub, SiGitlab, SiGitea, SiBitbucket } from "react-icons/si";

import { Badge } from "@/Components/UI/Badge";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";

import { GitKey, GitPlatformToStr, GitPlatformType } from "@/Types";
import { helpLinks } from "@/Consts";

import { useToast } from "@/Components/UI/useToast";
import { useProfile, UserProfile } from "@/Contexts/ProfileContext";
import { GenerateGitKeyAPI, DeleteGitKeyAPI } from "@/API";

const CardIcon = ({ platform }: { platform: GitPlatformType }) => {
  switch (platform) {
    case GitPlatformType.Github:
      return <SiGithub className="mr-2 w-6 h-6" />;
    case GitPlatformType.Gitlab:
      return <SiGitlab className="mr-2 w-6 h-6" />;
    case GitPlatformType.Gitea:
      return <SiGitea className="mr-2 w-6 h-6" />;
    case GitPlatformType.Bitbucket:
      return <SiBitbucket className="mr-2 w-6 h-6" />;
  }
};

const GitCard = ({ gitKey }: { gitKey: GitKey }) => {
  const { toast } = useToast();
  const { profile, setProfile } = useProfile();

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toast({
        title: "Copied",
        description: "Key copied to clipboard",
      });
    });
  };

  const handleDelete = async (keyID: string) => {
    let response = await DeleteGitKeyAPI(keyID);
    if (response.status === 200) {
      let newProfile = { ...profile };
      if (newProfile.gitKeys !== undefined) {
        newProfile.gitKeys = newProfile.gitKeys.map(key => {
          if (key.id === keyID) {
            key.key = "";
          }
          return key;
        });
        setProfile(newProfile as UserProfile);
      }
      toast({
        title: "Success",
        description: "Key deleted",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while deleting key",
      });
    }
  };

  const handleGenerate = async (keyID: string) => {
    let response = await GenerateGitKeyAPI(keyID);
    if (response.status === 200) {
      let newProfile = { ...profile };
      if (newProfile.gitKeys !== undefined) {
        newProfile.gitKeys = newProfile.gitKeys.map(key => {
          if (key.id === keyID) {
            key.key = response.data.key;
            key.date = response.data.date;
          }
          return key;
        });
        setProfile(newProfile as UserProfile);
      }
      toast({
        title: "Success",
        description: "Key generated",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while generating key",
      });
    }
  };

  const handleHelp = (platform: GitPlatformType) => {
    let url = "";
    switch (platform) {
      case GitPlatformType.Github:
        url = helpLinks.github;
        break;
      case GitPlatformType.Gitlab:
        url = helpLinks.gitlab;
        break;
      case GitPlatformType.Gitea:
        url = helpLinks.gitea;
        break;
      case GitPlatformType.Bitbucket:
        url = helpLinks.bitbucket;
        break;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col rounded-lg border p-4 space-y-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <CardIcon platform={gitKey.platform} />
          <div className="text-lg font-semibold">
            {GitPlatformToStr(gitKey.platform)}
          </div>
        </div>
        <Badge variant="outline">
          {gitKey?.key ? new Date(gitKey.date).toDateString() : "Not Connected"}
        </Badge>
      </div>
      <div className="flex flex-row space-x-2">
        <Input
          disabled={!gitKey.key}
          value={gitKey.key ? gitKey.key : "Generate Public Key First"}
          placeholder="Public Key"
        />
        {gitKey.key ? (
          <>
            <Button
              variant="outline"
              onClick={() => handleCopy(gitKey?.key ?? "")}
            >
              <FaCopy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGenerate(gitKey?.id)}
            >
              <FaArrowsRotate className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button variant="outline" onClick={() => handleDelete(gitKey?.id)}>
              <FaTrash className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => handleHelp(gitKey?.platform)}
            >
              <FaQuestionCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => handleGenerate(gitKey?.id)}>
            <FaArrowRotateLeft className="mr-2 w-4 h-4" />
            Generate
          </Button>
        )}
      </div>
    </div>
  );
};

export default GitCard;
