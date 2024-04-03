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

import { ApiPlatformToStr, ApiPlatformType } from "@/Types";
import { Button } from "@/Components/UI/Button";
import { DialogClose } from "@radix-ui/react-dialog";

const ApiCardHelp = ({ platform }: { platform: ApiPlatformType }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaQuestionCircle className="mr-2 w-4 h-4" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${ApiPlatformToStr(platform)} Help`}</DialogTitle>
          <DialogDescription>Connect your API account</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {platform === ApiPlatformType.Colab && <p>Colab</p>}
          {platform === ApiPlatformType.Kaggle && <p>Kaggle</p>}
          {platform === ApiPlatformType.GPT && <p>GPT</p>}
          {platform === ApiPlatformType.Perplexity && <p>Perplexity</p>}
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

export default ApiCardHelp;
