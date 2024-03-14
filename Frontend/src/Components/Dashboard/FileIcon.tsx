import { TbBrandCpp } from "react-icons/tb";
import { FaFile } from "react-icons/fa";

const FileIcon = ({ extension }: { extension: string }) => {
  switch (extension) {
    case "cpp":
      return <TbBrandCpp className="bg-primary/30 p-2 rounded-lg w-10 h-10" />;
    case "c":
      return <TbBrandCpp className="bg-primary/30 p-2 rounded-lg w-10 h-10" />;
    default:
      return <FaFile className="bg-primary/30 p-2 rounded-lg w-10 h-10" />;
  }
};

export default FileIcon;
