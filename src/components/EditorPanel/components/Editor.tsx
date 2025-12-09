import MonacoEditor, { DiffEditor } from "@monaco-editor/react";
import { useExplorer } from "../hooks/useExplorer";

const showDiff = false;

const Editor = () => {
  const { selectedFile: selectedFile, updateFileContent } = useExplorer();

  const code =
    selectedFile && "content" in selectedFile ? selectedFile.content : "";
  let language = selectedFile ? selectedFile.name.split(".").pop() : "text";

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "ts" || language === "tsx") language = "typescript";
  else if (language === "yml") language = "yaml";

  if (showDiff) {
    return (
      <DiffEditor
        // TODO: Fix width issue
        width="99%"
        theme="light"
        language={language}
        options={{
          readOnly: true,
          renderSideBySide: true,
        }}
        original={code}
        modified=""
      />
    );
  }

  return (
    <MonacoEditor
      // TODO: Fix width issue
      width="99%"
      theme="light"
      language={language}
      onChange={(txt: string | undefined) => txt && updateFileContent(txt)}
      value={code}
    />
  );
};

export default Editor;
