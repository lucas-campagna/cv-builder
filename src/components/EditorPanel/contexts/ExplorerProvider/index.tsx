import { createContext, useEffect, useMemo, useState } from "react";
import defaultExplorer from "./defaultExplorer";

export interface FileNode {
  path: string;
  content: string;
}

export type Path = string;
export type Explorer = {
  id: string;
  name: string;
  path: string[];
  content: string;
};

export interface ExplorerState {
  currentSessionName: any;
  selectedFileIndex: number;
  fileTree: Explorer[];
  renamingFile: string | null;
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
  selectedFileIndex: 0,
  fileTree: defaultExplorer as Explorer[],
  currentSessionName: DEFAULT_SESSION as string,
  renamingFile: "" as string | null,
  sessionNames: [] as string[],
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
  startRenaming: (_: string | null) => {},
  stopRenaming: () => {},
};

export const ExplorerContext = createContext(defaultExplorerContext);

const ExplorerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ExplorerState>({
    fileTree: defaultExplorerContext.fileTree,
    selectedFileIndex: defaultExplorerContext.selectedFileIndex,
    currentSessionName: defaultExplorerContext.currentSessionName,
    renamingFile: defaultExplorerContext.renamingFile,
  });

  const newSession = (sessionName: string) => {
    const fileTree = [
      {
        id: crypto.randomUUID(),
        name: DEFAULT_SELECTED_FILE,
        path: [],
        content: DEFAULT_MAIN_FILE_CONTENT,
      },
    ];
    setState({
      fileTree,
      selectedFileIndex: 0,
      currentSessionName: sessionName,
      renamingFile: null,
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
      const fileTree = JSON.parse(sessionData) as Explorer[];
      setState((prevState) => ({
        ...prevState,
        fileTree,
        selectedFileIndex: 0,
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
      fileTree: [
        ...prevState.fileTree,
        { id: crypto.randomUUID(), name: newFileName, path: [], content: "" },
      ],
      selectedFileIndex: -1,
    }));
  };

  const rmFile = (id: string) => {
    setState((prevState) => {
      const newFileTree = prevState.fileTree.filter(
        ({ id: fileId }) => fileId !== id
      );
      return {
        ...prevState,
        fileTree: newFileTree,
        selectedFileIndex:
          prevState.fileTree[prevState.selectedFileIndex]?.id === id
            ? 0
            : prevState.selectedFileIndex,
      };
    });
  };

  const selectFile = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      selectedFileIndex: (() => {
        const index = prevState.fileTree.findIndex((file) => file.id === id);
        return index !== -1 ? index : prevState.selectedFileIndex;
      })(),
    }));
  };

  const renameFile = (id: string, name: string) => {
    stopRenaming();
    setState((prevState) => ({
      ...prevState,
      fileTree: prevState.fileTree.map((file) => {
        if (file.id === id) {
          file.name = name;
        }
        return file;
      }),
    }));
  };

  const updateSelectedFileContent = (content: string) => {
    setState((prevState) => ({
      ...prevState,
      fileTree: [
        ...prevState.fileTree.slice(0, prevState.selectedFileIndex),
        {
          ...prevState.fileTree[prevState.selectedFileIndex],
          content,
        },
        ...prevState.fileTree.slice(prevState.selectedFileIndex + 1),
      ],
    }));
  };

  const copyFile = (id: string) => {
    setState((prevState) => {
      const file = state.fileTree.find((f) => f.id === id);
      if (!file) return prevState;
      const ext = file.name.split(".").pop();
      const newFileName = `${file.name}-copy.${ext}`;
      return {
        ...prevState,
        fileTree: [
          ...prevState.fileTree,
          { ...file, id: crypto.randomUUID(), name: newFileName },
        ],
        selectedFileIndex: state.fileTree.length,
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

  const startRenaming = (path: string | null) => {
    setState((prevState) => ({
      ...prevState,
      renamingFile: path,
    }));
  };

  const stopRenaming = () => setState((s) => ({ ...s, renamingFile: null }));

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
        updateFileContent: updateSelectedFileContent,
        copyFile,
        newSession,
        saveSession,
        loadSession,
        deleteSession,
        renameSession,
        startRenaming,
        stopRenaming,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export default ExplorerProvider;
