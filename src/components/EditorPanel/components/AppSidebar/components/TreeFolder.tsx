import type { Path } from "../../../contexts/ExplorerProvider";
import { useExplorer } from "../../../hooks/useExplorer";
import OptionMenu from "@/components/OptionMenu";
import { Input } from "@/components/ui/input";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronRight, Folder } from "lucide-react";
import React, { useEffect } from "react";
import Tree from "./Tree";

const TreeFolder = ({ folder }: { folder: Path }) => {
  const path = folder.id;
  const {
    addFile,
    startRenaming,
    renamingFile,
    renameFolder,
    stopRenaming,
    addDirectory,
    copyDirectory,
    rmDirectory,
    moveFile,
  } = useExplorer();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const items = [
    { label: "New file", onClick: () => startRenaming(addFile(path)) },
    { label: "New folder", onClick: () => startRenaming(addDirectory(path)) },
    { label: "Rename", onClick: () => startRenaming(folder.id) },
    { label: "Copy", onClick: () => copyDirectory(folder.id) },
    { label: "Delete", onClick: () => rmDirectory(folder.id) },
  ];
  const renameInputRef = React.useRef<HTMLInputElement>(null);
  const isRenaming = renamingFile === folder.id;
  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      renameFolder(renameInputRef.current?.value || folder.name);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData("fileId", folder.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const fileId = e.dataTransfer.getData("fileId");
    if (fileId && fileId !== folder.id) {
      moveFile(fileId, folder.id);
    }
  };

  useEffect(() => {
    if (isRenaming) {
      setTimeout(() => {
        renameInputRef.current?.select();
      }, 200);
    }
  }, [isRenaming]);

  return (
    <OptionMenu items={items}>
      <SidebarMenuItem onDoubleClick={() => startRenaming(folder.id)}>
        <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={isDragOver ? "bg-accent" : ""}
            >
              <ChevronRight className="transition-transform" />
              <Folder />
              {isRenaming ? (
                <Input
                  autoFocus
                  ref={renameInputRef}
                  onFocus={(e) => e.currentTarget.select()}
                  defaultValue={folder.name}
                  onKeyDown={handleRename}
                  onBlur={stopRenaming}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span draggable onDragStart={handleDragStart}>
                  {folder.name}
                </span>
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <Tree root={path} />
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </OptionMenu>
  );
};

export default TreeFolder;
