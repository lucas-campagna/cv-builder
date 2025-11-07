import { A4 } from "@/constants";
import useAppState from "@/hooks/useAppState";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { renderToString } from "react-dom/server";
import { createPortal } from "react-dom";
import { useEffect } from "react";

const Document = () => {
  const { isDebugging, onePage, fontSize } = useAppState();
  const { Document } = useDynamicComponents();
  const documentStyle = {
    ...A4,
    fontSize,
  };
  // @ts-ignore
  const StyledDocument = () => <Document style={documentStyle} />;
  const DocumentPortal = () =>
    // @ts-ignore
    createPortal(<StyledDocument />, document.getElementById("document")!);

  useEffect(() => {
    // Refresh lucide icons after each render
    if (typeof window !== "undefined" && (window as any).lucide) {
      try {
        (window as any).lucide.createIcons();
      } catch {}
    }
  }, [Document]);

  const classView = onePage
    ? `bg-gray-100 flex justify-center items-start h-full w-full overflow-y-auto`
    : "bg-gray-100 flex justify-center items-start h-full w-full";
  const classPaper = onePage
    ? `bg-white h-[${A4.height}] overflow-y-hidden overflow-x-auto`
    : `bg-white h-full overflow-y-auto overflow-x-auto`;

  return (
    <div className={classView}>
      <div className={classPaper}>
        <DocumentPortal />
        {isDebugging ? renderToString(<StyledDocument />) : <StyledDocument />}
      </div>
    </div>
  );
};

export default Document;
