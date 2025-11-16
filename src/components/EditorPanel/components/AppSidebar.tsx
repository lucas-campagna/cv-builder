import * as React from "react";
import { ChevronRight, File, Folder } from "lucide-react";

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
import useHotkeys from "@/hooks/useHotkeys";
import { useEffect } from "react";

type TreeItem = {
  name: string;
  path: string;
  children: string[];
};

const joinPath = (...parts: string[]): string =>
  parts.filter(Boolean).join("/");

const parsePaths = (paths: string[], root: string = ""): TreeItem[] =>
  Object.entries(
    paths.reduce((acc, fullPath) => {
      const [origin, ...parts] = fullPath.split("/");
      return {
        ...acc,
        [origin]: {
          path: joinPath(root, fullPath),
          children: [
            ...(acc?.[origin]?.children || []),
            ...(parts.length ? [joinPath(...parts)] : []),
          ],
        },
      };
    }, {} as Record<string, Omit<TreeItem, "name">>)
  )
    .map(([name, props]) => ({ name, ...props } as TreeItem))
    .sort((a, b) => {
      const aIsFile = a.children.length === 0;
      const bIsFile = b.children.length === 0;
      if (aIsFile && !bIsFile) return 1;
      if (!aIsFile && bIsFile) return -1;
      return a.name.localeCompare(b.name);
    });

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { addFile } = useExplorer();
  // const tree = parsePaths(Object.keys(fileTree));
  const items = [
    { label: "New", onClick: () => addFile() },
    { label: "Rename" },
    { label: "Copy" },
    { label: "Delete" },
  ];
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
  // const { name, path, children: fileTree } = item;
  // const tree = parsePaths(fileTree, joinPath(root, name));
  // const isFile = fileTree.length === 0;
  const {
    selectFile,
    selectedFile: selectedFile,
    addFile,
    rmFile,
    renameFile,
    copyFile,
    renamingFile,
    startRenaming,
    stopRenaming,
    fileTree,
  } = useExplorer();
  const files = fileTree.filter(
    (file) =>
      file.path.length === root.length &&
      file.path.every((part, index) => part === root[index])
  );
  const folders = fileTree.filter(
    (file) =>
      file.path.length > root.length &&
      file.path.every((part, index) => part === root[index])
  );

  // const [isRenaming, setIsRenaming] = React.useState(false);
  // const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     renameFile(path, e.currentTarget.value);
  //   }
  // };
  // const isRenaming = renamingFile === path;
  // const renameInputRef = React.useRef<HTMLInputElement>(null);
  // const newFile = () => {
  //   addFile();
  //   startRenaming(path);
  // };
  // const items = [
  //   {
  //     label: "New",
  //     onClick: newFile,
  //   },
  //   { label: "Rename", onClick: () => startRenaming(path) },
  //   {
  //     label: "Copy",
  //     onClick: () => {
  //       copyFile(path);
  //       startRenaming(path);
  //     },
  //   },
  //   { label: "Delete", onClick: () => rmFile(path) },
  // ];

  // useHotkeys({
  //   escape: stopRenaming,
  //   f2: () => startRenaming(path),
  //   "alt+n": newFile, // Placeholder for new file action
  // });

  // useEffect(() => {
  //   if (isRenaming) {
  //     setTimeout(() => {
  //       renameInputRef.current?.select();
  //     }, 200);
  //   }
  // }, [isRenaming]);

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {tree.map((item, index) => (
              <Tree key={index} item={item} root={joinPath(root, name)} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

const TreeLeaf = () => {
  return (
    <OptionMenu items={items}>
      <SidebarMenuButton
        isActive={path === selectedFile}
        className="data-[active=true]:bg-transparent"
        onClick={() => selectFile(path)}
      >
        <File />
        {isRenaming ? (
          <Input
            autoFocus
            ref={renameInputRef}
            onFocus={(e) => e.currentTarget.select()}
            defaultValue={name}
            onKeyDown={handleRename}
            onBlur={() => stopRenaming()}
          />
        ) : (
          name
        )}
      </SidebarMenuButton>
    </OptionMenu>
  );
};
