import { Badge } from "@/Components/UI/Badge";
import { Status } from "@/Types";
import { capitalizeFirstLetter } from "@/Utils";

const StatusBadge = ({ status }: { status: Status | null }) => {
  return (
    <Badge
      variant={
        status == "vulnerable"
          ? "destructive"
          : status === "clean"
          ? "default"
          : "secondary"
      }
    >
      {capitalizeFirstLetter(
        status ? (status == "false" ? "false positive" : status) : ""
      )}
    </Badge>
  );
};
export default StatusBadge;
