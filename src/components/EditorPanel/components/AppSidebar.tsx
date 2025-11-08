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
  const { fileTree, addFile } = useExplorer();
  const tree = parsePaths(Object.keys(fileTree));
  const items = [
    { label: "New", onClick: () => addFile() },
    { label: "Rename" },
    { label: "Copy" },
    { label: "Delete" },
  ];
  return (
    <OptionMenu items={items}>
      <Sidebar {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Files</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tree.map((item, index) => (
                  <Tree key={index} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </OptionMenu>
  );
}

function Tree({ item, root = "" }: { item: TreeItem; root?: string }) {
  const { name, path, children: fileTree } = item;
  const tree = parsePaths(fileTree, joinPath(root, name));
  const isFile = fileTree.length === 0;
  const { selectFile, selectedFile, addFile, rmFile, renameFile, copyFile } =
    useExplorer();
  const [isRenaming, setIsRenaming] = React.useState(false);
  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      renameFile(path, e.currentTarget.value);
      setIsRenaming(false);
    }
  };
  const items = [
    { label: "New", onClick: () => addFile() },
    { label: "Rename", onClick: () => setIsRenaming(true) },
    {
      label: "Copy",
      onClick: () => {
        copyFile(path);
        setIsRenaming(true);
      },
    },
    { label: "Delete", onClick: () => rmFile(path) },
  ];

  if (isFile && path) {
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
              defaultValue={name}
              onKeyDown={handleRename}
              onBlur={() => setIsRenaming(false)}
            />
          ) : (
            name
          )}
        </SidebarMenuButton>
      </OptionMenu>
    );
  }

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
