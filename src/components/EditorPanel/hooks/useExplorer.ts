import { ExplorerContext } from "@/components/EditorPanel/contexts/ExplorerProvider";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { useContext, useEffect } from "react";

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  const { update } = useDynamicComponents();
  if (!context) {
    throw new Error("useExplorer must be used within an ExplorerProvider");
  }
  const fileContent = context.selectedFile
    ? context.fileTree[context.selectedFile]
    : null;
  useEffect(() => {
    const allContent = Object.values(context.fileTree).join("\n\n");
    update(allContent);
  }, [fileContent]);
  return context;
};
