import { FaQuestionCircle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/UI/Dialog";

import { GitPlatformToStr, GitPlatformType } from "@/Types";
import { Button } from "@/Components/UI/Button";
import { DialogClose } from "@radix-ui/react-dialog";

const GitCardHelp = ({ platform }: { platform: GitPlatformType }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaQuestionCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${GitPlatformToStr(platform)} Help`}</DialogTitle>
          <DialogDescription>
            Connect your Git account to run scans on your private repositories.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {platform === GitPlatformType.Github && <p>Github</p>}
          {platform === GitPlatformType.Gitlab && <p>Gitlab</p>}
          {platform === GitPlatformType.Gitea && <p>Gitea</p>}
          {platform === GitPlatformType.Bitbucket && <p>Bitbucket</p>}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GitCardHelp;
