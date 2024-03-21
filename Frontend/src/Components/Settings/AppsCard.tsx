import { GiArtificialHive } from "react-icons/gi";
import { FaKaggle, FaSave, FaTrash, FaQuestionCircle } from "react-icons/fa";
import { SiGooglecolab } from "react-icons/si";
import { TbLetterP } from "react-icons/tb";

import { Badge } from "@/Components/UI/Badge";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { AppKey } from "@/Types";

type AppsVariant = "GPT" | "Perplexity" | "Kaggle" | "Colab";

const CardIcon = ({ variant }: { variant: AppsVariant }) => {
  switch (variant) {
    case "GPT":
      return <GiArtificialHive className="mr-2 w-6 h-6" />;
    case "Perplexity":
      return <TbLetterP className="mr-2 w-6 h-6" />;
    case "Kaggle":
      return <FaKaggle className="mr-2 w-6 h-6" />;
    case "Colab":
      return <SiGooglecolab className="mr-2 w-6 h-6" />;
  }
};

const AppsCard = ({
  variant,
  appKey,
}: {
  variant: AppsVariant;
  appKey: AppKey;
}) => {
  return (
    <div className="flex flex-col rounded-lg border p-4 space-y-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <CardIcon variant={variant} />
          <div className="text-lg font-semibold">{variant}</div>
        </div>
        <Badge variant="outline">
          {appKey?.key ? appKey.date.toDateString() : "Not Connected"}
        </Badge>
      </div>
      <div className="flex flex-row space-x-2">
        <Input value={appKey?.key ?? ""} placeholder="API Key" />
        <Button variant="outline">
          <FaSave className="mr-2 w-4 h-4" />
          Save
        </Button>
        {appKey?.key && (
          <Button variant="outline">
            <FaTrash className="mr-2 w-4 h-4" />
            Delete
          </Button>
        )}
        <Button variant="outline">
          <FaQuestionCircle className="mr-2 w-4 h-4" />
          Help
        </Button>
      </div>
    </div>
  );
};

export default AppsCard;
