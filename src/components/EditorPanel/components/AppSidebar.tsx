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
  const newFile = () => {
    addFile();
    rename();
  };
  const items = [
    { label: "New", onClick: addFile },
    { label: "Rename", onClick: rename },
    { label: "Copy", onclick: copy },
    { label: "Delete", rm },
  ];

  useHotkeys({
    escape: stopRenaming,
    f2: rename,
    "alt+n": newFile,
  });

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
    .filter(
      (file) =>
        file.path.length > root.length &&
        root.every((part, index) => part === file.path[index])
    )
    .map((folder) => folder.path.slice(0, root.length + 1).join("/"))
    .reduce((folders, folder) => {
      if (!folders.includes(folder)) {
        folders.push(folder);
      }
      return folders;
    }, [] as string[])
    .map((folder) => folder.split("/"));

  return (
    <>
      {folders.map((folder, index) => (
        <TreeFolder root={folder} key={index} />
      ))}
      {files.map((file, index) => (
        <TreeFile file={file} key={index} />
      ))}
    </>
  );
}

const TreeFolder = ({ root }: { root: string[] }) => {
  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {root.at(-1)}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <Tree root={root} />
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
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
    addFile,
  } = useExplorer();

  const isRenaming = renamingFile === file.id;
  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      renameFile(e.currentTarget.value);
    }
  };
  // const isRenaming = renamingFile === path;
  const rename = () => startRenaming(file.id);
  const renameInputRef = React.useRef<HTMLInputElement>(null);
  const newFile = () => {
    addFile();
    rename();
  };
  const items = [
    {
      label: "New",
      onClick: newFile,
    },
    { label: "Rename", onClick: () => rename() },
    {
      label: "Copy",
      onClick: () => {
        copyFile(file.id);
        rename();
      },
    },
    { label: "Delete", onClick: () => rmFile(file.id) },
  ];

  // useEffect(() => {
  //   if (isRenaming) {
  //     setTimeout(() => {
  //       renameInputRef.current?.select();
  //     }, 500);
  //   }
  // }, [isRenaming]);

  return (
    <OptionMenu items={items}>
      <SidebarMenuButton
        isActive={file.id === selectedFile?.id}
        className="data-[active=true]:bg-transparent"
        onClick={() => selectFile(file.id)}
      >
        <FileIcon />
        {file.id === renamingFile ? (
          <Input
            autoFocus
            ref={renameInputRef}
            onFocus={(e) => e.currentTarget.select()}
            defaultValue={file.name}
            onKeyDown={handleRename}
            onBlur={() => stopRenaming()}
          />
        ) : (
          file.name
        )}
      </SidebarMenuButton>
    </OptionMenu>
  );
};
