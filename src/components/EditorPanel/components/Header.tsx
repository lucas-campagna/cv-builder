import { memo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { type File, type Path } from "../contexts/ExplorerProvider";
import { useExplorer } from "../hooks/useExplorer";

const Header = ({ file }: { file: File | Path | null }) => {
  const { selectedFile, getFullPath } = useExplorer();
  if (!selectedFile) return null;

  return (
    <Breadcrumb className="select-none">
      <BreadcrumbList>
        {file?.id &&
          getFullPath(file.id).map((part, index, arr) => (
            <BreadcrumbItem key={index}>
              {index < arr.length - 1 ? (
                <BreadcrumbLink>{part}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{part}</BreadcrumbPage>
              )}
              {index < arr.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default memo(Header);
