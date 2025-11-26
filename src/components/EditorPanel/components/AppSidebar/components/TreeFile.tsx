import { useExplorer } from "../../../hooks/useExplorer";
import OptionMenu from "@/components/OptionMenu";
import { Input } from "@/components/ui/input";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { File as FileIcon } from "lucide-react";
import React, { useEffect } from "react";
import { type File } from "../../../contexts/ExplorerProvider";

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

export default TreeFile;
