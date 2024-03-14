import { Platform } from "@/Types";
import {
  SiBitbucket,
  SiGithub,
  SiGitlab,
  SiGitea,
  SiGit,
} from "react-icons/si";

const RepositoryIcon = ({ platform }: { platform: Platform }) => {
  switch (platform) {
    case "github":
      return <SiGithub />;
    case "gitlab":
      return <SiGitlab />;
    case "gitea":
      return <SiGitea />;
    case "bitbucket":
      return <SiBitbucket />;
    default:
      return <SiGit />;
  }
};

export default RepositoryIcon;
