import MonacoEditor from "@monaco-editor/react";
import { useExplorer } from "../hooks/useExplorer";

const Editor = ({ onChange }: { onChange: (_: string) => void }) => {
  const { selectedFile = "", fileTree } = useExplorer();

  const code = fileTree[selectedFile!] || "";
  let language = selectedFile ? selectedFile.split(".").pop() : "text";

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "ts" || language === "tsx") language = "typescript";
  else if (language === "yml") language = "yaml";

  return (
    <div className="w-full m-0 text-[16px]">
      <MonacoEditor
        onChange={(txt) => txt && onChange(txt)}
        height="100vh"
        language={language}
        value={code}
        theme="light"
      />
    </div>
  );
};

export default Editor;
