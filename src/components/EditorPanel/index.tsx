import { memo, useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
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
import useHotkeys from "@/hooks/useHotkeys";
import { HELP_PAGE_URL } from "@/constants";
import SessionsDialog from "./components/SessionsDialog";
import Header from "./components/Header";

function EditorPanel() {
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const { toggleOnePage, onePage, fontSize, setFontSize } = useAppState();
  const {
    selectedFile: selectedFile,
    currentSessionName,
    saveSession,
    renameSession,
  } = useExplorer();
  const [newName, setNewName] = useState<string | null>(null);

  function handleSave() {
    confirm("Do you want to save the current session?") && saveSession();
  }
  function handleOpenDocument() {
    setSessionDialogOpen(true);
  }
  function handleOpenHelp() {
    (window as any).open(HELP_PAGE_URL, "_blank");
  }

  useHotkeys({
    "ctrl+o": handleOpenDocument,
    "ctrl+s": handleSave,
    "ctrl+?": handleOpenHelp,
  });

  const headerIcons = [
    {
      icon: LibraryBig,
      tooltip: "Open Document (Ctrl+O)",
      onClick: handleOpenDocument,
    },
    { icon: Save, tooltip: "Save (Ctrl+S)", onClick: handleSave },
    {
      icon: Download,
      tooltip: "Generate PDF (Ctrl+P)",
      onClick: () => (window as any).print(),
    },
    {
      icon: MessageCircleQuestionMark,
      tooltip: "Help (Ctrl+?)",
      onClick: handleOpenHelp,
    },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <header className="bg-sidebar/90 border-b-2 h-8 py-2 px-2 flex items-center justify-between">
        <div className="flex gap-2">
          {headerIcons.map(({ icon: Icon, tooltip, onClick }, index) => (
            <Tooltip key={index} tooltip={tooltip}>
              <Icon className="size-6 p-1" onClick={onClick} />
            </Tooltip>
          ))}
        </div>
        <div>
          {newName !== null ? (
            <Input
              type="text"
              value={newName}
              className="h-6 p-1 text-xs bg-white"
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => {
                setNewName(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  renameSession(newName);
                  setNewName(null);
                }
              }}
              autoFocus
            />
          ) : (
            <span
              className="select-none text-gray-500"
              onClick={() => setNewName(currentSessionName)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setNewName(currentSessionName);
                }
              }}
              tabIndex={0}
            >
              {currentSessionName}
            </span>
          )}
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
      <SidebarProvider defaultOpen={false}>
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
              <Header
                path={
                  selectedFile
                    ? selectedFile.path.concat(selectedFile.name)
                    : []
                }
              />
            </div>
          </header>
          <Editor />
        </SidebarInset>
      </SidebarProvider>
      {sessionDialogOpen && (
        <SessionsDialog
          open={sessionDialogOpen}
          onOpenChange={setSessionDialogOpen}
        />
      )}
    </div>
  );
}

export default memo(({ ...props }: any) => (
  <ExplorerProvider>
    <EditorPanel {...props} />
  </ExplorerProvider>
));
