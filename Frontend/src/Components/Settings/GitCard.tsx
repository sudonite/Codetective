import { FaCopy, FaTrash, FaQuestionCircle } from "react-icons/fa";
import { FaArrowsRotate, FaArrowRotateLeft } from "react-icons/fa6";
import { SiGithub, SiGitlab, SiGitea, SiBitbucket } from "react-icons/si";

import { Badge } from "@/Components/UI/Badge";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";

import { GitKey, GitPlatform } from "@/Types";

const Header = ({ platform }: { platform: GitPlatform }) => {
  switch (platform) {
    case "github":
      return (
        <div className="flex flex-row items-center">
          <SiGithub className="mr-2 w-6 h-6" />
          <div className="text-lg font-semibold">GitHub</div>
        </div>
      );
    case "gitlab":
      return (
        <div className="flex flex-row items-center">
          <SiGitlab className="mr-2 w-6 h-6" />
          <div className="text-lg font-semibold">GitLab</div>
        </div>
      );
    case "gitea":
      return (
        <div className="flex flex-row items-center">
          <SiGitea className="mr-2 w-6 h-6" />
          <div className="text-lg font-semibold">Gitea</div>
        </div>
      );
    case "bitbucket":
      return (
        <div className="flex flex-row items-center">
          <SiBitbucket className="mr-2 w-6 h-6" />
          <div className="text-lg font-semibold">Bitbucket</div>
        </div>
      );
  }
};

const GitCard = ({ gitKey }: { gitKey: GitKey }) => {
  return (
    <div className="flex flex-col rounded-lg border p-4 space-y-4">
      <div className="flex flex-row justify-between">
        <Header platform={gitKey.platform} />
        <Badge variant="outline">
          {gitKey?.key ? gitKey.date.toDateString() : "Not Connected"}
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
            <Button variant="outline">
              <FaCopy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline">
              <FaArrowsRotate className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button variant="outline">
              <FaTrash className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline">
              <FaQuestionCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </>
        ) : (
          <Button variant="outline">
            <FaArrowRotateLeft className="mr-2 w-4 h-4" />
            Generate
          </Button>
        )}
      </div>
    </div>
  );
};

export default GitCard;
