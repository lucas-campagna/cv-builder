import { AppSidebar } from "./components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ExplorerProvider from "@/components/EditorPanel/contexts/ExplorerProvider";
import Editor from "./components/Editor";
import { useExplorer } from "./hooks/useExplorer";
import { Download, StickyNote } from "lucide-react";
import useAppState from "@/hooks/useAppState";
import Tooltip from "../Tooltip";
import { Input } from "../ui/input";

function EditorPanel() {
  const { toggleOnePage, onePage, fontSize, setFontSize } = useAppState();
  const { updateFileContent, selectedFile } = useExplorer();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between items-center border-b px-4">
          <div className="flex h-16 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Header path={selectedFile} />
          </div>
          <div className="flex gap-2">
            <Tooltip tooltip="Font Size">
              <Input
                type='number'
                value={fontSize}
                className="w-16 h-6 p-1 text-xs"
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </Tooltip>
            <Tooltip tooltip="Generate PDF">
              <Download
                className="size-6 p-1"
                onClick={() => (window as any).print()}
              />
            </Tooltip>
            <Tooltip tooltip="One Page View">
              <StickyNote
                className={`size-6 rounded-full p-1 ${
                  onePage && "bg-gray-300"
                }`}
                onClick={() => toggleOnePage()}
              />
            </Tooltip>
          </div>
        </header>
        <Editor onChange={updateFileContent} />,
      </SidebarInset>
    </SidebarProvider>
  );
}

const Header = ({ path }: { path: string | null }) => (
  <Breadcrumb className="select-none">
    <BreadcrumbList>
      {path?.split("/").map((part, index, arr) => (
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

export default ({ ...props }: any) => (
  <ExplorerProvider>
    <EditorPanel {...props} />
  </ExplorerProvider>
);
