import { TbBrandVscode } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { FaGit, FaShieldAlt } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/Components/UI/DropdownMenu";
import { Button } from "@/Components/UI/Button";

import StatusBadge from "@/Components/Dashboard/StatusBadge";
import { Code, GitPlatformType, Repository, StatusType } from "@/Types";

interface CodeDropdownProps {
  repository: Repository | null;
  selectedCode: Code | null;
  wordWrap: boolean;
  lineNumbers: boolean;
  setWordWrap: (wordWrap: boolean) => void;
  setLineNumbers: (lineNumbers: boolean) => void;
  onStatusChange: (status: StatusType) => void;
}

const CodeDropdown = ({
  repository,
  selectedCode,
  onStatusChange,
  wordWrap,
  lineNumbers,
  setWordWrap,
  setLineNumbers,
}: CodeDropdownProps) => {
  const handleOpenRepository = () => {
    if (repository?.url) {
      window.open(repository.url.replace(new RegExp(".git$"), ""), "_blank");
    }
  };

  const handleOpenInVSCode = () => {
    console.log("in function");
    switch (repository?.platform) {
      case GitPlatformType.Github:
        console.log("github");
        window.open(
          repository?.url
            .replace(new RegExp(".git$"), "")
            .replace("github.com", "github.dev"),
          "_blank"
        );
        break;
      case GitPlatformType.Gitlab:
        console.log("gitlab");
        const parts = repository?.url
          .replace(new RegExp(".git$"), "")
          .split("/");
        const path = parts.slice(3).join("/");
        window.open(
          `https://gitlab.com/-/ide/project/${path}/edit/master/-`,
          "_blank"
        );
        break;
      case GitPlatformType.Bitbucket:
        console.log("bitbucket");
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={!selectedCode}>
        <Button
          disabled={!selectedCode}
          variant="ghost"
          className="flex items-center justify-between space-x-4"
        >
          {selectedCode && (
            <StatusBadge status={selectedCode?.status ?? null} />
          )}
          <IoMdSettings className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleOpenRepository}
            disabled={!repository?.url.startsWith("http")}
          >
            <FaGit className="mr-2 h-4 w-4" />
            Open repository
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenInVSCode}
            disabled={
              !repository?.url.startsWith("http") ||
              (repository.platform !== GitPlatformType.Github &&
                repository.platform !== GitPlatformType.Gitlab)
            }
          >
            <TbBrandVscode className="mr-2 h-4 w-4" />
            Open in VSCode
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FaShieldAlt className="mr-2 h-4 w-4" />
            Change status
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem
                onCheckedChange={() => onStatusChange(StatusType.Fixed)}
                checked={selectedCode?.status === StatusType.Fixed}
              >
                <StatusBadge status={StatusType.Fixed} />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={() => onStatusChange(StatusType.Vulnerable)}
                checked={selectedCode?.status === StatusType.Vulnerable}
              >
                <StatusBadge status={StatusType.Vulnerable} />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={() => onStatusChange(StatusType.FalsePositive)}
                checked={selectedCode?.status === StatusType.FalsePositive}
              >
                <StatusBadge status={StatusType.FalsePositive} />
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={wordWrap}
            onCheckedChange={() => setWordWrap(!wordWrap)}
          >
            Word Wrap
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={lineNumbers}
            onCheckedChange={() => setLineNumbers(!lineNumbers)}
          >
            Line Numbers
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default CodeDropdown;
