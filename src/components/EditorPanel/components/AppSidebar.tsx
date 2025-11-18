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
  // const { name, path, children: fileTree } = item;
  // const tree = parsePaths(fileTree, joinPath(root, name));
  // const isFile = fileTree.length === 0;
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
  // .filter((v,i,a)=>a.findIndex(t=>t.name===v.name)===i);

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

  console.log(folders, files);

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
  const { selectedFile, selectFile, renamingFile, stopRenaming, renameFile } =
    useExplorer();
  const renameInputRef = React.useRef<HTMLInputElement>(null);

  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      renameFile(file.id);
    }
  };

  const items = [
    { label: "New" },
    { label: "Rename" },
    { label: "Copy" },
    { label: "Delete" },
  ];
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
            onBlur={() => stopRenaming()}
          />
        ) : (
          file.name
        )}
      </SidebarMenuButton>
    </OptionMenu>
  );
};
