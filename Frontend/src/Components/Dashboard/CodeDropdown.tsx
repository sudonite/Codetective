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
import { Code, Status } from "@/Types";

interface CodeDropdownProps {
  selectedCode: Code | null;
  wordWrap: boolean;
  lineNumbers: boolean;
  setWordWrap: (wordWrap: boolean) => void;
  setLineNumbers: (lineNumbers: boolean) => void;
  onStatusChange: (status: Status) => void;
}

const CodeDropdown = ({
  selectedCode,
  onStatusChange,
  wordWrap,
  lineNumbers,
  setWordWrap,
  setLineNumbers,
}: CodeDropdownProps) => {
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
          <DropdownMenuItem disabled>
            <FaGit className="mr-2 h-4 w-4" />
            Open repository
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
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
                onCheckedChange={() => onStatusChange("fixed")}
                checked={selectedCode?.status === "fixed"}
              >
                <StatusBadge status="fixed" />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={() => onStatusChange("vulnerable")}
                checked={selectedCode?.status === "vulnerable"}
              >
                <StatusBadge status="vulnerable" />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={() => onStatusChange("false")}
                checked={selectedCode?.status === "false"}
              >
                <StatusBadge status="false" />
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
