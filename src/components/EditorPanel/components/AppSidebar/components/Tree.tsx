import type { File, Path } from "../../../contexts/ExplorerProvider";
import { useExplorer } from "../../../hooks/useExplorer";
import TreeFile from "./TreeFile";
import TreeFolder from "./TreeFolder";
import React from "react";

function Tree({ root = "" }: { root?: Path["path"] }) {
  const { fileTree, moveFile } = useExplorer();
  const [isDragOver, setIsDragOver] = React.useState(false);

  const files = fileTree
    .filter((file) => file.type === "file" && file.path === root)
    .sort((a, b) => a.name.localeCompare(b.name)) as File[];
  const folders = fileTree
    .filter((file) => file.type === "folder" && file.path === root)
    .sort((a, b) => a.name.localeCompare(b.name));

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
    if (fileId) {
      moveFile(fileId, root);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`h-full ${isDragOver ? "bg-accent/50 rounded-md" : ""}`}
    >
      {[
        ...folders.map((folder, index) => (
          <TreeFolder key={`folder-${index}`} folder={folder} />
        )),
        ...files.map((file, index) => (
          <TreeFile key={`file-${index}`} file={file} />
        )),
      ]}
    </div>
  );
}

export default Tree;
