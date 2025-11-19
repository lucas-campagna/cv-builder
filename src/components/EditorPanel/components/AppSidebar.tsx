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
import { type File } from "../contexts/ExplorerProvider";
import useHotkeys from "@/hooks/useHotkeys";
import { useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    addFile,
    selectedFile,
    stopRenaming,
    startRenaming,
    copyFile,
    rmFile,
  } = useExplorer();
  const rename = () => selectedFile && startRenaming(selectedFile.id);
  const copy = () => selectedFile && copyFile(selectedFile.id);
  const rm = () => selectedFile && rmFile(selectedFile.id);
  const newFile = () => startRenaming(addFile());
  const items = [
    { label: "New", onClick: newFile },
    { label: "Rename", onClick: rename },
    { label: "Copy", onclick: copy },
    { label: "Delete", rm },
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
          <SidebarGroup>
            <SidebarGroupLabel>Changes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* <Tree key={index} item={item} /> */}
                {/* {tree.map((item, index) => (
                  <Tree key={index} item={item} />
                ))} */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </OptionMenu>
  );
}

function Tree({ root = [] }: { root?: string[] }) {
  const { fileTree } = useExplorer();
  const files = fileTree.filter(
    (file) =>
      file.path.length === root.length &&
      root.every((part, index) => part === file.path[index])
  );
  const folders = fileTree
    .filter((file) => file.path.length > root.length)
    .reduce(
      (acc, { path, ...props }) =>
        acc.some((prev) =>
          prev.path.every((part, index) => part === path[index])
        )
          ? acc
          : [
              ...acc,
              {
                ...props,
                path: path.slice(0, root.length + 1),
              },
            ],
      [] as File[]
    );
  return folders
    .map((folder, index) => (
      <TreeFolder key={`folder-${index}`} folder={folder} />
    ))
    .concat(
      files.map((file, index) => <TreeFile key={`file-${index}`} file={file} />)
    );
}

const TreeFolder = ({ folder }: { folder: File }) => (
  <SidebarMenuItem>
    <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton>
          <ChevronRight className="transition-transform" />
          <Folder />
          {folder.path.at(-1)}
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          <Tree root={folder.path} />
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  </SidebarMenuItem>
);
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
    addFile,
  } = useExplorer();
  const renameInputRef = React.useRef<HTMLInputElement>(null);

  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      renameFile(renameInputRef.current?.value || file.name);
    }
  };

  const items = [
    { label: "New", onClick: () => startRenaming(addFile()) },
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
      >
        <FileIcon />
        {renamingFile === file.id ? (
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
