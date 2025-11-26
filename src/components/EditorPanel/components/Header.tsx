import { memo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { type File } from "../contexts/ExplorerProvider";

const Header = memo(({ path }: { path: File["path"] }) => (
  <Breadcrumb className="select-none">
    <BreadcrumbList>
      {path.map((part, index, arr) => (
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
));

export default Header;
