import MonacoEditor, { DiffEditor } from "@monaco-editor/react";
import { useExplorer } from "../hooks/useExplorer";

const Editor = () => {
  const { selectedFile = "", fileTree, updateFileContent } = useExplorer();

  const code = fileTree[selectedFile!] || "";
  let language = selectedFile ? selectedFile.split(".").pop() : "text";

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "ts" || language === "tsx") language = "typescript";
  else if (language === "yml") language = "yaml";

  const showDiff = false;
  const Editor = showDiff ? DiffEditor : MonacoEditor;
  const props = showDiff
    ? {
        options: {
          readOnly: true,
          renderSideBySide: true,
        },
        original: code,
        modified: "",
      }
    : {
        onChange: (txt: string | undefined) => txt && updateFileContent(txt),
        value: code,
      };

  return (
    <div className="w-full m-0 text-[16px]">
      <Editor height="100vh" language={language} theme="light" {...props} />
    </div>
  );
};

export default Editor;
