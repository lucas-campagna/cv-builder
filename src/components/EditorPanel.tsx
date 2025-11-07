import { useMemo, useState } from "react";
import Editor from "./Editor";
import type { YamlData } from "@/utils/parseDynamicComponents";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import Explorer from "./Explorer";
import { useExplorer } from "@/hooks/useExplorer";

const EditorPanel = () => {
  const { update } = useDynamicComponents();
  const { state } = useExplorer();

  const initialText = useMemo(
    () =>
      state.fileTree.find((f) => f.path === state.selectedFile)?.content || "",
    [state.fileTree, state.selectedFile]
  );

  return (
    <div className="h-full bg-white rounded-sm flex h-full">
      <Explorer />
      <div className="flex-1 overflow-auto">
        <Editor
          initialText={initialText}
          onChange={(data: YamlData) => update(data)}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
