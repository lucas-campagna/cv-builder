import { ExplorerContext, type File } from "@/components/EditorPanel/contexts/ExplorerProvider";
import useDebounced from "@/hooks/useDebounced";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { useContext } from "react";

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  const { update } = useDynamicComponents();
  if (!context) {
    throw new Error("useExplorer must be used within an ExplorerProvider");
  }
  const content = context.selectedFile && 'content' in context.selectedFile
    ? context.selectedFile.content
    : "";
  useDebounced(
    {
      delay: 100,
      callback: () => {
        const allContent = Object.values(
          context.fileTree
            .filter(file => 'content' in file)
            .map(({ content }: File) => content)
        ).join("\n\n");
        update(allContent);
      },
    },
    [content]
  );
  return context;
};
