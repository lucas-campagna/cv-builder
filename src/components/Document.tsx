import { A4 } from "@/constants";
import useAppState from "@/hooks/useAppState";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { renderToString } from "react-dom/server";
import { createPortal } from "react-dom";
import { useEffect } from "react";

const Document = () => {
  const { isDebugging, onePage } = useAppState();
  const { Document } = useDynamicComponents();
  const DocumentPortal = () =>
    // @ts-ignore
    createPortal(<Document style={A4} />, document.getElementById("document")!);

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
    ? `bg-white min-w-[${A4.width}] w-[${A4.width}] h-[${A4.height}] overflow-hidden`
    : `bg-white min-w-[${A4.width}] w-[${A4.width}] h-full overflow-y-auto`;

  return (
    <div className={classView}>
      <div className={classPaper}>
        <DocumentPortal />
        {isDebugging ? renderToString(<Document />) : <Document />}
      </div>
    </div>
  );
};

export default Document;
