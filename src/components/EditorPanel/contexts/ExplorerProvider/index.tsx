import { createContext, useEffect, useMemo, useState } from "react";
import defaultExplorer from "./defaultExplorer";

export interface FileNode {
  path: string;
  content: string;
}

export type Path = string;
export type File = {
  id: string;
  name: string;
  path: string[];
  content: string;
};

export interface ExplorerState {
  currentSessionName: any;
  selectedFile: File | null;
  fileTree: File[];
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
  selectedFile: defaultExplorer[0] as File | null,
  fileTree: defaultExplorer as File[],
  currentSessionName: DEFAULT_SESSION as string,
  renamingFile: "" as string | null,
  sessionNames: [] as string[],
  selectFile: (_: Path) => {},
  addFile: (_?: File["path"]) => "",
  rmFile: (_: Path) => {},
  renameFile: (_: Path) => {},
  updateFileContent: (_: string) => {},
  copyFile: (_: string) => {},
  newSession: (_: string) => {},
  saveSession: () => {},
  loadSession: (_: string) => {},
  deleteSession: (_: string) => {},
  renameSession: (_: string) => {},
  startRenaming: (_: string) => {},
  stopRenaming: () => {},
};

export const ExplorerContext = createContext(defaultExplorerContext);

const ExplorerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ExplorerState>({
    fileTree: defaultExplorerContext.fileTree,
    selectedFile: defaultExplorerContext.selectedFile,
    currentSessionName: defaultExplorerContext.currentSessionName,
    renamingFile: defaultExplorerContext.renamingFile,
  });

  const newSession = (sessionName: string) => {
    const id = crypto.randomUUID();
    const fileTree = [
      {
        id,
        name: DEFAULT_SELECTED_FILE,
        path: [],
        content: DEFAULT_MAIN_FILE_CONTENT,
      },
    ];
    setState({
      fileTree,
      selectedFile: fileTree[0],
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
      return { ...state };
    });
  };

  const loadSession = (sessionName: string) => {
    const sessionData = localStorage.getItem(`explorer-session-${sessionName}`);
    if (sessionData) {
      const fileTree = JSON.parse(sessionData) as File[];
      setState((prevState) => ({
        ...prevState,
        fileTree,
        selectedFile: fileTree[0] || null,
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

  const addFile = (root: File["path"] = []) => {
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
    const id = crypto.randomUUID();
    const newFile = {
      id,
      name: newFileName,
      path: root,
      content: "",
    };
    setState((prevState) => ({
      ...prevState,
      fileTree: [...prevState.fileTree, newFile],
      selectedFile: newFile,
    }));
    return id;
  };

  const rmFile = (id: string) => {
    setState((prevState) => {
      const newFileTree = prevState.fileTree.filter(
        ({ id: fileId }) => fileId !== id
      );
      return {
        ...prevState,
        fileTree: newFileTree,
        selectedFile: newFileTree[0] || null,
      };
    });
  };

  const selectFile = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      selectedFile: prevState.fileTree.find((file) => file.id === id) || null,
    }));
  };

  const renameFile = (name: string) => {
    if (!state.renamingFile) return;
    const id = state.renamingFile;
    setState((prevState) => ({
      ...prevState,
      renamingFile: null,
      fileTree: prevState.fileTree.map((file) => {
        if (file.id === id) {
          file.name = name;
        }
        return file;
      }),
    }));
  };

  const updateSelectedFileContent = (content: string) => {
    setState((prevState) => {
      if (prevState.selectedFile) {
        prevState.selectedFile.content = content;
        prevState.fileTree = prevState.fileTree.map((file) => {
          if (file.id === prevState.selectedFile!.id) {
            file.content = content;
          }
          return file;
        });
      }
      return { ...prevState };
    });
  };

  const copyFile = (id: string) => {
    setState((prevState) => {
      const file = prevState.fileTree.find((f) => f.id === id);
      if (!file) return { ...prevState };
      const [name, ext] = file.name.split(".");
      const newFileName = `${name}-copy.${ext}`;
      const newFile = { ...file, id: crypto.randomUUID(), name: newFileName };
      return {
        ...prevState,
        fileTree: [...prevState.fileTree, newFile],
        selectedFile: newFile,
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

  const startRenaming = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      renamingFile: id,
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
