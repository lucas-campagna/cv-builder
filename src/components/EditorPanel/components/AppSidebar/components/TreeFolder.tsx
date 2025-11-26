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
  } = useExplorer();
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
            <SidebarMenuButton>
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
                folder.name
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
