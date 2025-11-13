import { createContext, useState } from "react";
import defaultFileTree from "./defaultFileTree";

export interface FileNode {
  path: string;
  content: string;
}

export type Path = string;
export type FileTree = { [key: Path]: string };

export interface ExplorerState {
  currentSessionName: any;
  selectedFile: Path | null;
  fileTree: FileTree;
}

const DEFAULT_FILE_NAME = "new-file";

const defaultExplorerContext = {
  selectedFile: "main.yml" as string | null,
  fileTree: defaultFileTree as FileTree,
  currentSessionName: "default-session" as string,
  selectFile: (_: Path) => {},
  addFile: () => {},
  rmFile: (_: Path) => {},
  renameFile: (_: Path, __: Path) => {},
  updateFileContent: (_: string) => {},
  copyFile: (_: string) => {},
  saveSession: () => {},
  loadSession: (_: string) => {},
  deleteSession: (_: string) => {},
};

export const ExplorerContext = createContext(defaultExplorerContext);

const ExplorerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ExplorerState>({
    fileTree: defaultExplorerContext.fileTree,
    selectedFile: defaultExplorerContext.selectedFile,
    currentSessionName: defaultExplorerContext.currentSessionName,
  });

  const saveSession = () => {
    localStorage.setItem(
      `explorer-session-${state.currentSessionName}`,
      JSON.stringify(state.fileTree)
    );
  };

  const loadSession = (sessionName: string) => {
    const sessionData = localStorage.getItem(`explorer-session-${sessionName}`);
    if (sessionData) {
      const fileTree = JSON.parse(sessionData) as FileTree;
      setState((prevState) => ({
        ...prevState,
        fileTree,
        selectedFile: Object.keys(fileTree)[0] || null,
        currentSessionName: sessionName,
      }));
    }
  };

  const deleteSession = (sessionName: string) => {
    localStorage.removeItem(`explorer-session-${sessionName}`);
  };

  const addFile = () => {
    const newFileName = (() => {
      let fileName = `${DEFAULT_FILE_NAME}.yml`;
      let counter = 1;
      while (true) {
        const exists = fileName in state.fileTree;
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

  const copyFile = (path: string) => {
    if (!(path in state.fileTree)) return;
    setState((prevState) => {
      const [name, ext] = path.split(".");
      const newFileName = `${name}-copy.${ext}`;
      return {
        ...prevState,
        fileTree: {
          ...prevState.fileTree,
          [newFileName]: prevState.fileTree[path],
        },
        selectedFile: newFileName,
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
        copyFile,
        saveSession,
        loadSession,
        deleteSession,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export default ExplorerProvider;
