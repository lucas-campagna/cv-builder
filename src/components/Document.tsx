import { A4 } from "@/constants";
import useAppState from "@/hooks/useAppState";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { renderToString } from "react-dom/server";


const Document = () => {
  const { isDebugging } = useAppState();
  const { Cv } = useDynamicComponents();
  return (
    <div className={"doc font-sans mx-auto p-3 bg-white shadow-lg text-gray-900 leading-relaxed"} style={A4}>
      {isDebugging ? renderToString(<Cv />) : <Cv />}
    </div>
  )
};

export default Document;
