import { createContext, useState } from "react";
import defaultContent from '@/assets/defaultContent.yml?raw';


export interface FileNode {
  path: string;
  content: string;
}

export interface ExplorerState {
  selectedFile: string | null;
  fileTree: FileNode[];
}

const DEFAULT_FILE_NAME = "new-file";

const defaultExplorerContext = {
  state: {
    selectedFile: "curriculum.yml",
    fileTree: [
      {
        path: "curriculum.yml",
        content: defaultContent,
      },
    ],
  } as ExplorerState,
  selectFile: (_: string) => {},
  addFile: () => {},
  rmFile: (_: string) => {},
  renameFile: (_: string, __: string) => {},
};

export const ExplorerContext = createContext(defaultExplorerContext);

const ExplorerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ExplorerState>(
    defaultExplorerContext.state
  );

  const addFile = () => {
    const newFileName = (() => {
      let fileName = `${DEFAULT_FILE_NAME}.yml`;
      let counter = 1;
      while (true) {
        const exists = state.fileTree.some((f) => f.path === fileName);
        if (!exists) return fileName;
        fileName = `${DEFAULT_FILE_NAME}-${counter}.yml`;
        counter++;
      }
    })();
    const newFile = {
      path: newFileName,
      content: "",
    };
    setState((prevState) => ({
      ...prevState,
      fileTree: [...prevState.fileTree, newFile],
      selectedFile: newFile.path,
    }));
  };

  const rmFile = (path: string) => {
    setState((prevState) => ({
      ...prevState,
      fileTree: prevState.fileTree.filter((f) => f.path !== path),
      selectedFile:
        prevState.selectedFile === path ? null : prevState.selectedFile,
    }));
  };

  const selectFile = (path: string) => {
    const file = state.fileTree.find((f) => f.path === path);
    setState((prevState) => ({
      ...prevState,
      selectedFile: file?.path ?? null,
    }));
  };

  const renameFile = (oldPath: string, newPath: string) => {
    setState((prevState) => ({
      ...prevState,
      fileTree: prevState.fileTree.map((f) =>
        f.path === oldPath ? { ...f, path: newPath } : f
      ),
      selectedFile:
        prevState.selectedFile === oldPath ? newPath : prevState.selectedFile,
    }));
  };

  return (
    <ExplorerContext.Provider
      value={{ state, selectFile, addFile, rmFile, renameFile }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export default ExplorerProvider;
