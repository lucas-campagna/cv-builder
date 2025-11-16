import MonacoEditor, { DiffEditor } from "@monaco-editor/react";
import { useExplorer } from "../hooks/useExplorer";

const showDiff = false;

const Editor = () => {
  const { selectedFile: selectedFile, updateFileContent } = useExplorer();

  const code = selectedFile?.content || "";
  let language = selectedFile ? selectedFile.name.split(".").pop() : "text";

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "ts" || language === "tsx") language = "typescript";
  else if (language === "yml") language = "yaml";

  if (showDiff) {
    return (
      <DiffEditor
        height="100vh"
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
    <div className="h-full w-full m-0 text-[16px]">
      <MonacoEditor
        height="100vh"
        theme="light"
        language={language}
        onChange={(txt: string | undefined) => txt && updateFileContent(txt)}
        value={code}
      />
    </div>
  );
};

export default Editor;
