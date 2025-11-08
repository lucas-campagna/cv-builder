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
import {
  Download,
  LibraryBig,
  MessageCircleQuestionMark,
  Save,
  StickyNote,
} from "lucide-react";
import useAppState from "@/hooks/useAppState";
import Tooltip from "../Tooltip";
import { Input } from "../ui/input";
import useHotkey from "@/hooks/useHotkey";

function EditorPanel() {
  const { toggleOnePage, onePage, fontSize, setFontSize } = useAppState();
  const { selectedFile } = useExplorer();

  function handleSave() {
    alert("Save triggered");
  }
  function handleOpenDocument() {
    alert("Open Document triggered");
  }
  function handleOpenHelp() {
    alert("Help triggered");
  }

  useHotkey({
    hotkey: "ctrl+o",
    callback: handleOpenDocument,
  });
  useHotkey({
    hotkey: "ctrl+s",
    callback: handleSave,
  });
  useHotkey({
    hotkey: "ctrl+?",
    callback: handleOpenHelp,
  });

  const headerIcons = [
    {
      icon: LibraryBig,
      tooltip: "Open Document (Ctrl+O)",
      action: handleOpenDocument,
    },
    { icon: Save, tooltip: "Save (Ctrl+S)", action: handleSave },
    {
      icon: Download,
      tooltip: "Generate PDF (Ctrl+P)",
      action: () => (window as any).print(),
    },
    {
      icon: MessageCircleQuestionMark,
      tooltip: "Help (Ctrl+?)",
      action: handleOpenHelp,
    },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <header className="bg-sidebar/90 border-b-2 h-8 py-2 px-2 flex items-center justify-between">
        <div className="flex gap-2">
          {headerIcons.map(({ icon: Icon, tooltip, action }, index) => (
            <Tooltip key={index} tooltip={tooltip}>
              <Icon className="size-6 p-1" onClick={action} />
            </Tooltip>
          ))}
        </div>
        <div className="flex gap-2">
          <Tooltip tooltip="Font Size">
            <Input
              type="number"
              value={fontSize}
              className="w-16 h-6 p-1 text-xs bg-white"
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </Tooltip>
          <Tooltip tooltip="One Page View">
            <StickyNote
              className={`size-6 rounded-full p-1 ${onePage && "bg-gray-300"}`}
              onClick={() => toggleOnePage()}
            />
          </Tooltip>
        </div>
      </header>
      <SidebarProvider>
        <AppSidebar className="mt-8 h-[calc(100%-8)]" />
        <SidebarInset>
          <header className="flex justify-between items-center border-b px-4 h-10">
            <div className="flex h-16 items-center gap-2">
              <Tooltip tooltip="Toggle Sidebar (Ctrl+B)">
                <SidebarTrigger className="-ml-1" />
              </Tooltip>
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Header path={selectedFile} />
            </div>
          </header>
          <Editor />,
        </SidebarInset>
      </SidebarProvider>
    </div>
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
