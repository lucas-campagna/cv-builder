import { ExplorerContext } from "@/components/EditorPanel/contexts/ExplorerProvider";
import useDebounced from "@/hooks/useDebounced";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { useContext } from "react";

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  const { update } = useDynamicComponents();
  if (!context) {
    throw new Error("useExplorer must be used within an ExplorerProvider");
  }
  const fileContent =
    context.selectedFile && context.selectedFile in context.fileTree
      ? context.fileTree[context.selectedFile]
      : null;
  useDebounced(
    {
      delay: 100,
      func: () => {
        const allContent = Object.values(context.fileTree).join("\n\n");
        update(allContent);
      },
    },
    [fileContent]
  );
  return context;
};
