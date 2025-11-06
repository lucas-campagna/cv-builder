import { useMemo, useState } from "react";
import Editor from "./Editor";
import type { YamlData } from "@/utils/parseDynamicComponents";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import Explorer from "./Explorer";
import { useExplorer } from "@/hooks/useExplorer";

const EditorPanel = () => {
  const [content, setContent] = useState<YamlData>({});
  const [structure, setStructure] = useState<YamlData>({});
  const { update } = useDynamicComponents();
  const { state } = useExplorer();
  // const { toggleDebug } = useAppState();

  const handleContentChange = (data: YamlData) => {
    console.log("Content changed:", data);
    setContent(data);
    update({ ...structure, ...data });
  };

  const initialText = useMemo(
    () =>
      state.fileTree.find((f) => f.path === state.selectedFile)?.content || "",
    [state.fileTree, state.selectedFile]
  );

  return (
    <div className="h-full bg-white rounded-sm flex h-full">
      <Explorer />
      <div className="flex-1 overflow-auto">
        <Editor initialText={initialText} onChange={handleContentChange} />
      </div>
    </div>
  );
};

export default EditorPanel;
