import { A4 } from "@/constants";
import useAppState from "@/hooks/useAppState";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { renderToString } from "react-dom/server";


const Document = () => {
  const { isDebugging } = useAppState();
  const { Document } = useDynamicComponents();
  return (
    <div className={"doc mx-auto bg-white"} style={A4}>
      {isDebugging ? renderToString(<Document />) : <Document />}
    </div>
  )
};

export default Document;
