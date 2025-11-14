import { createContext, useEffect, useMemo, useState } from "react";
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
const DEFAULT_SESSION = "CV Lucas Prett Campagna";
const DEFAULT_SELECTED_FILE = "main.yml";
const DEFAULT_MAIN_FILE_CONTENT = `document:
  - h1: new document
    style: bg-red-100 font-bold text-xl
  - h2: subtitle
    style: text-blue-500 italic
  - p: this is a sample paragraph.
  - example_of_component
  - p: you can edit this content as you like

example_of_component:
  h3: section title
  style: underline text-green-600
`;

const defaultExplorerContext = {
  selectedFile: DEFAULT_SELECTED_FILE as string | null,
  fileTree: defaultFileTree as FileTree,
  currentSessionName: DEFAULT_SESSION as string,
  selectFile: (_: Path) => {},
  addFile: () => {},
  rmFile: (_: Path) => {},
  renameFile: (_: Path, __: Path) => {},
  updateFileContent: (_: string) => {},
  copyFile: (_: string) => {},
  newSession: (_: string) => {},
  saveSession: () => {},
  loadSession: (_: string) => {},
  deleteSession: (_: string) => {},
  renameSession: (_: string) => {},
  sessionNames: [] as string[],
};

export const ExplorerContext = createContext(defaultExplorerContext);

const ExplorerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ExplorerState>({
    fileTree: defaultExplorerContext.fileTree,
    selectedFile: defaultExplorerContext.selectedFile,
    currentSessionName: defaultExplorerContext.currentSessionName,
  });

  const newSession = (sessionName: string) => {
    const fileTree = {
      [DEFAULT_SELECTED_FILE]: DEFAULT_MAIN_FILE_CONTENT,
    };
    setState({
      fileTree,
      selectedFile: DEFAULT_SELECTED_FILE,
      currentSessionName: sessionName,
    });
    localStorage.setItem(
      `explorer-session-${sessionName}`,
      JSON.stringify(fileTree)
    );
  };

  const saveSession = () => {
    setState((state) => {
      localStorage.setItem(
        `explorer-session-${state.currentSessionName}`,
        JSON.stringify(state.fileTree)
      );
      return state;
    });
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
    setState((s) => ({ ...s }));
  };

  const renameSession = (newName: string) => {
    const oldName = state.currentSessionName;
    localStorage.setItem(
      `explorer-session-${newName}`,
      JSON.stringify(state.fileTree)
    );
    localStorage.removeItem(`explorer-session-${oldName}`);
    setState((prevState) => ({
      ...prevState,
      currentSessionName: newName,
    }));
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

  const sessionNames = useMemo(() => {
    const sessions: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("explorer-session-")) {
        sessions.push(key.replace("explorer-session-", ""));
      }
    }
    if (sessions.length === 0) {
      sessions.push(DEFAULT_SESSION);
    }
    return sessions;
  }, [state]);

  useEffect(() => {
    saveSession();
  }, []);

  return (
    <ExplorerContext.Provider
      value={{
        ...state,
        sessionNames,
        selectFile,
        addFile,
        rmFile,
        renameFile,
        updateFileContent,
        copyFile,
        newSession,
        saveSession,
        loadSession,
        deleteSession,
        renameSession,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export default ExplorerProvider;
