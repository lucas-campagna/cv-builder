import { A4 } from "@/constants";
import useAppState from "@/hooks/useAppState";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { renderToString } from "react-dom/server";

const Document = () => {
  const { isDebugging } = useAppState();
  const { Document } = useDynamicComponents();

  return (
    <div className="bg-gray-100 h-full w-full flex justify-center items-start">
      <div
        className={`doc min-w-[${A4.width}] h-full bg-white overflow-y-auto`}
      >
        {isDebugging ? renderToString(<Document />) : <Document />}
      </div>
    </div>
  );
};

export default Document;
