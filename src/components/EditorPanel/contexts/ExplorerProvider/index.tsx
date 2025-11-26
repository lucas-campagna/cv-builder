import { createContext, useEffect, useMemo, useState } from "react";
import defaultExplorer from "./defaultExplorer";

export interface FileNode {
  path: File["path"];
  content: File["content"];
}

export type Path = {
  id: string;
  name: string;
  path: Path["id"];
  type: "file" | "folder";
};
export type File = Path & {
  content: string;
};

export interface ExplorerState {
  currentSessionName: any;
  selectedFile: (Path | File) | null;
  fileTree: (Path | File)[];
  renamingFile: string | null;
}

const DEFAULT_FILE_NAME = "new-file";
const DEFAULT_FOLDER_NAME = "new-folder";
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
  selectedFile: defaultExplorer[0] as (Path | File) | null,
  fileTree: defaultExplorer as (Path | File)[],
  currentSessionName: DEFAULT_SESSION as string,
  renamingFile: "" as string | null,
  sessionNames: [] as string[],
  selectFile: (_: File["id"]) => {},
  addFile: (_?: File["path"]) => "" as File["id"],
  addDirectory: (_?: Path["path"]) => "" as File["id"],
  rmFile: (_: File["id"]) => {},
  rmDirectory: (_: Path["id"]) => {},
  renameFile: (_: File["name"]) => {},
  renameFolder: (_: Path["name"]) => {},
  updateFileContent: (_: string) => {},
  copyFile: (_: File["id"]) => {},
  copyDirectory: (_: Path["id"]) => {},
  moveFile: (_fileId: File["id"], _targetPath: Path["path"]) => {},
  newSession: (_: string) => {},
  saveSession: () => {},
  loadSession: (_: string) => {},
  deleteSession: (_: string) => {},
  renameSession: (_: string) => {},
  startRenaming: (_: string) => {},
  stopRenaming: () => {},
  getFullPath: (_: File["id"]) => [] as File["name"][],
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
        content: DEFAULT_MAIN_FILE_CONTENT,
        type: "file",
      } as File,
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

  const addFile = (root: File["path"] = "") => {
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
      type: "file",
    } as File;
    setState((prevState) => ({
      ...prevState,
      fileTree: [...prevState.fileTree, newFile],
      selectedFile: newFile,
    }));
    return id;
  };

  const addDirectory = (root: File["path"] = "") => {
    const newDirectoryName = (() => {
      let fileName = `${DEFAULT_FOLDER_NAME}`;
      let counter = 1;
      while (true) {
        const exists = fileName in state.fileTree;
        if (!exists) return fileName;
        fileName = `${DEFAULT_FOLDER_NAME}-${counter}`;
        counter++;
      }
    })();
    const id = crypto.randomUUID();
    const newFile = {
      id,
      name: newDirectoryName,
      path: root,
      content: "",
      type: "folder",
    };
    setState(
      (prevState) =>
        ({
          ...prevState,
          fileTree: [...prevState.fileTree, newFile],
        } as ExplorerState)
    );
    return id;
  };

  const rmFile = (id: File["id"]) => {
    const confirmed = confirm(
      "This action can not be undone. Are you sure you want to delete this file?"
    );
    if (!confirmed) return;
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

  const rmDirectory = (id: Path["id"]) => {
    const confirmed = confirm(
      "This action can not be undone. Are you sure you want to delete this folder and all its contents?"
    );
    if (!confirmed) return;
    setState((prevState) => {
      const newFileTree = prevState.fileTree.filter(
        ({ id: folderId, path }) => folderId !== id && path !== id
      );
      return {
        ...prevState,
        fileTree: newFileTree,
        selectedFile: newFileTree[0] || null,
      };
    });
  };

  const selectFile = (id: Path["id"]) => {
    setState((prevState) => ({
      ...prevState,
      selectedFile: prevState.fileTree.find((file) => file.id === id) || null,
    }));
  };

  const renameFile = (name: File["name"]) => {
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

  const renameFolder = (name: Path["name"]) => renameFile(name);

  const updateSelectedFileContent = (content: File["content"]) => {
    setState((prevState) => {
      if (prevState.selectedFile?.type === "file") {
        (prevState.selectedFile as File).content = content;
        prevState.fileTree = prevState.fileTree.map((file) => {
          if (file.type === "file" && file.id === prevState.selectedFile!.id) {
            (file as File).content = content;
          }
          return file;
        });
      }
      return { ...prevState };
    });
  };

  const copyFile = (id: File["id"]) => {
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

  const copyDirectory = (id: Path["id"]) => {
    setState((prevState) => {
      const folder = prevState.fileTree.find((f) => f.id === id);
      if (!folder) return { ...prevState };
      const newFolder = {
        ...folder,
        id: crypto.randomUUID(),
        name: `${folder.name}-copy`,
      };
      const newFiles = prevState.fileTree.reduce(
        (acc, file) =>
          file.path === id
            ? [...acc, { ...file, id: crypto.randomUUID(), path: newFolder.id }]
            : acc,
        [] as (Path | File)[]
      );
      return {
        ...prevState,
        fileTree: [...prevState.fileTree, newFolder, ...newFiles],
        selectedFile: newFolder,
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

  const getFullPath = (id: File["id"]): File["name"][] => {
    const current = state.fileTree.find((file) => file.id === id);
    if (!current) return [];
    return [...getFullPath(current.path), current.name];
  };

  const moveFile = (fileId: File["id"], targetPath: Path["path"]) => {
    setState((prevState) => {
      // Check if moving a folder into itself or one of its descendants
      const movingItem = prevState.fileTree.find((file) => file.id === fileId);
      if (movingItem?.type === "folder") {
        // Check if targetPath is the folder itself
        if (targetPath === fileId) {
          return prevState;
        }
        // Check if targetPath is a descendant of the folder being moved
        let currentPath = targetPath;
        while (currentPath) {
          if (currentPath === fileId) {
            return prevState; // Prevent moving folder into its own descendant
          }
          const parent = prevState.fileTree.find((f) => f.id === currentPath);
          currentPath = parent?.path || "";
        }
      }

      return {
        ...prevState,
        fileTree: prevState.fileTree.map((file) => {
          if (file.id === fileId) {
            return { ...file, path: targetPath };
          }
          return file;
        }),
      };
    });
  };

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
        addDirectory,
        rmFile,
        rmDirectory,
        renameFile,
        renameFolder,
        updateFileContent: updateSelectedFileContent,
        copyFile,
        copyDirectory,
        moveFile,
        newSession,
        saveSession,
        loadSession,
        deleteSession,
        renameSession,
        startRenaming,
        stopRenaming,
        getFullPath,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export default ExplorerProvider;
