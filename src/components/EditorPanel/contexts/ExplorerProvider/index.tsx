import { createContext, useState } from "react";
import defaultFileTree from "./defaultFileTree";

export interface FileNode {
  path: string;
  content: string;
}

export type Path = string;
export type FileTree = { [key: Path]: string };

export interface ExplorerState {
  selectedFile: Path | null;
  fileTree: FileTree;
}

const DEFAULT_FILE_NAME = "new-file";

const defaultExplorerContext = {
  selectedFile: "main.yml" as string | null,
  fileTree: defaultFileTree as FileTree,
  selectFile: (_: Path) => {},
  addFile: () => {},
  rmFile: (_: Path) => {},
  renameFile: (_: Path, __: Path) => {},
  updateFileContent: (_: string) => {},
};

export const ExplorerContext = createContext(defaultExplorerContext);

const ExplorerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ExplorerState>({
    fileTree: defaultExplorerContext.fileTree,
    selectedFile: defaultExplorerContext.selectedFile,
  });

  const addFile = () => {
    const newFileName = (() => {
      let fileName = `${DEFAULT_FILE_NAME}.yml`;
      let counter = 1;
      while (true) {
        const exists = state.fileTree[fileName];
        if (!exists) return fileName;
        fileName = `${DEFAULT_FILE_NAME}-${counter}.yml`;
        counter++;
      }
    })();
    setState((prevState) => ({
      ...prevState,
      fileTree: {
        ...prevState.fileTree,
        [newFileName]: "",
      },
      selectedFile: newFileName,
    }));
  };

  const rmFile = (path: string) => {
    setState((prevState) => {
      const newFileTree = { ...prevState.fileTree };
      delete newFileTree[path];
      return {
        ...prevState,
        fileTree: newFileTree,
        selectedFile:
          prevState.selectedFile === path ? null : prevState.selectedFile,
      };
    });
  };

  const selectFile = (path: string) => {
    setState((prevState) => ({
      ...prevState,
      selectedFile: prevState.fileTree[path] ? path : prevState.selectedFile,
    }));
  };

  const renameFile = (oldPath: string, newPath: string) => {
    setState((prevState) => {
      const newFileTree = { ...prevState.fileTree };
      newFileTree[newPath] = newFileTree[oldPath];
      delete newFileTree[oldPath];
      return {
        ...prevState,
        fileTree: newFileTree,
        selectedFile:
          prevState.selectedFile === oldPath ? newPath : prevState.selectedFile,
      };
    });
  };

  const updateFileContent = (content: string) => {
    setState((prevState) => {
      if (!prevState.selectedFile) return prevState;
      return {
        ...prevState,
        fileTree: {
          ...prevState.fileTree,
          [prevState.selectedFile]: content,
        },
      };
    });
  };

  return (
    <ExplorerContext.Provider
      value={{
        ...state,
        selectFile,
        addFile,
        rmFile,
        renameFile,
        updateFileContent,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export default ExplorerProvider;
