import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useExplorer } from "../../hooks/useExplorer";
import OptionMenu from "../../../OptionMenu";
import useHotkeys from "@/hooks/useHotkeys";
import Tree from "./components/Tree";

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
          <SidebarGroup className="h-full">
            <SidebarGroupLabel>Files</SidebarGroupLabel>
            <SidebarGroupContent className="h-full">
              <SidebarMenu className="h-full">
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

export default AppSidebar;
