import { ExplorerContext } from "@/contexts/ExplorerProvider";
import { useContext } from "react";

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  if (!context) {
    throw new Error("useExplorer must be used within an ExplorerProvider");
  }
  return context;
};
