import * as React from "react";
import { ChevronRight, File as FileIcon, Folder } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useExplorer } from "../hooks/useExplorer";
import OptionMenu from "../../OptionMenu";
import { Input } from "@/components/ui/input";
import { type File, type Path } from "../contexts/ExplorerProvider";
import useHotkeys from "@/hooks/useHotkeys";
import { useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    addFile,
    addDirectory,
    selectedFile,
    stopRenaming,
    startRenaming,
    rmFile,
  } = useExplorer();
  const rename = () => selectedFile && startRenaming(selectedFile.id);
  const rm = () => selectedFile && rmFile(selectedFile.id);
  const newFile = () => startRenaming(addFile());
  const newDirectory = () => startRenaming(addDirectory());
  const items = [
    { label: "New file", onClick: newFile },
    { label: "New directory", onClick: newDirectory },
  ];

  useHotkeys(
    {
      escape: stopRenaming,
      f2: rename,
      "alt+n": newFile,
      delete: rm,
    },
    [selectedFile]
  );

  return (
    <OptionMenu items={items}>
      <Sidebar {...props}>
        <SidebarContent className="flex flex-col justify-between">
          <SidebarGroup>
            <SidebarGroupLabel>Files</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <Tree />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* <SidebarGroup>
            <SidebarGroupLabel>Changes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <Tree key={index} item={item} />
                {tree.map((item, index) => (
                  <Tree key={index} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </OptionMenu>
  );
}

function Tree({ root = "" }: { root?: Path["path"] }) {
  const { fileTree } = useExplorer();
  const files = fileTree
    .filter((file) => file.type === "file" && file.path === root)
    .sort((a, b) => a.name.localeCompare(b.name)) as File[];
  const folders = fileTree
    .filter((file) => file.type === "folder" && file.path === root)
    .sort((a, b) => a.name.localeCompare(b.name));
  return [
    ...folders.map((folder, index) => (
      <TreeFolder key={`folder-${index}`} folder={folder} />
    )),
    ...files.map((file, index) => (
      <TreeFile key={`file-${index}`} file={file} />
    )),
  ];
}

const TreeFolder = ({ folder }: { folder: Path }) => {
  const path = folder.id;
  const {
    addFile,
    startRenaming,
    renamingFile,
    renameFolder,
    stopRenaming,
    addDirectory,
  } = useExplorer();
  const items = [
    { label: "New file", onClick: () => startRenaming(addFile(path)) },
    { label: "New folder", onClick: () => startRenaming(addDirectory(path)) },
    { label: "Rename", onClick: () => startRenaming(folder.id) },
    { label: "Copy" },
    { label: "Delete" },
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
const TreeFile = ({ file }: { file: File }) => {
  const {
    selectedFile,
    selectFile,
    renamingFile,
    startRenaming,
    stopRenaming,
    renameFile,
    copyFile,
    rmFile,
  } = useExplorer();
  const renameInputRef = React.useRef<HTMLInputElement>(null);

  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      renameFile(renameInputRef.current?.value || file.name);
    }
  };

  const items = [
    { label: "Rename", onClick: () => startRenaming(file.id) },
    { label: "Copy", onClick: () => copyFile(file.id) },
    { label: "Delete", onClick: () => rmFile(file.id) },
  ];
  const isRenaming = renamingFile === file.id;

  useEffect(() => {
    if (isRenaming) {
      setTimeout(() => {
        renameInputRef.current?.select();
      }, 200);
    }
  }, [isRenaming]);

  return (
    <OptionMenu items={items}>
      <SidebarMenuButton
        isActive={!!selectedFile && file.id === selectedFile.id}
        className="data-[active=true]:bg-transparent"
        onClick={() => selectFile(file.id)}
        onDoubleClick={() => startRenaming(file.id)}
      >
        <FileIcon />
        {isRenaming ? (
          <Input
            autoFocus
            ref={renameInputRef}
            onFocus={(e) => e.currentTarget.select()}
            defaultValue={file.name}
            onKeyDown={handleRename}
            onBlur={stopRenaming}
          />
        ) : (
          file.name
        )}
      </SidebarMenuButton>
    </OptionMenu>
  );
};
