import { Badge } from "@/Components/UI/Badge";
import { StatusType } from "@/Types";

const statusToString = (status: StatusType | null) => {
  switch (status) {
    case StatusType.Clean:
      return "Clean";
    case StatusType.Vulnerable:
      return "Vulnerable";
    case StatusType.Running:
      return "Running";
    case StatusType.Fixed:
      return "Fixed";
    case StatusType.FalsePositive:
      return "False Positive";
  }
};

const StatusBadge = ({ status }: { status: StatusType | null }) => {
  return (
    <Badge
      variant={
        status == StatusType.Vulnerable
          ? "destructive"
          : status === StatusType.Clean
          ? "default"
          : "secondary"
      }
    >
      {statusToString(status)}
    </Badge>
  );
};
export default StatusBadge;
