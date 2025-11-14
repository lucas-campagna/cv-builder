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
  const Editor = (...props: any) =>
    showDiff ? (
      <DiffEditor
        {...props}
        options={{
          readOnly: true,
          renderSideBySide: true,
        }}
        original={code}
        modified=""
      />
    ) : (
      <MonacoEditor
        {...props}
        onChange={(txt: string | undefined) => txt && updateFileContent(txt)}
        value={code}
        c
      />
    );

  return (
    <div className="h-full w-full m-0 text-[16px]">
      <Editor height="100vh" language={language} theme="light" />
    </div>
  );
};

export default Editor;
