import type { File, Path } from "../../../contexts/ExplorerProvider";
import { useExplorer } from "../../../hooks/useExplorer";
import TreeFile from "./TreeFile";
import TreeFolder from "./TreeFolder";

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

export default Tree;
