import { A4 } from "@/constants";
import useDynamicComponents from "@/hooks/useDynamicComponents";


const Document = () => {
  const { Cv } = useDynamicComponents();
  return (
    <div className={"doc font-sans mx-auto p-3 bg-white shadow-lg text-gray-900 leading-relaxed"} style={A4}>
      <Cv />
    </div>
  )
};

export default Document;
