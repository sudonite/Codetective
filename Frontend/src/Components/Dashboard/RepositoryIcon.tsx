import { GitPlatformType } from "@/Types";
import {
  SiBitbucket,
  SiGithub,
  SiGitlab,
  SiGitea,
  SiGit,
} from "react-icons/si";

const RepositoryIcon = ({ platform }: { platform: GitPlatformType }) => {
  switch (platform) {
    case GitPlatformType.Github:
      return <SiGithub />;
    case GitPlatformType.Gitlab:
      return <SiGitlab />;
    case GitPlatformType.Gitea:
      return <SiGitea />;
    case GitPlatformType.Bitbucket:
      return <SiBitbucket />;
    default:
      return <SiGit />;
  }
};

export default RepositoryIcon;
