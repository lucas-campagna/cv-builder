import { A4 } from "@/constants";
import useAppState from "@/hooks/useAppState";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { renderToString } from "react-dom/server";
import { createPortal } from "react-dom";

const Document = () => {
  const { isDebugging } = useAppState();
  const { Document } = useDynamicComponents();
  const DocumentPortal = () =>
    createPortal(<Document />, document.getElementById("document")!);

  return (
    <div className="bg-gray-100 h-full w-full flex justify-center items-start">
      <div className={`min-w-[${A4.width}] h-full bg-white overflow-y-auto`}>
        <DocumentPortal />
        {isDebugging ? renderToString(<Document />) : <Document />}
      </div>
    </div>
  );
};

export default Document;
