import { useEffect, useState } from "react";
import { A4 } from "@/constants";
import Editor from "./Editor";
import { cn } from "@/lib/utils";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { Bug } from "lucide-react";
import Toggle from "./Toggle";
import useAppState from "@/hooks/useAppState";
import type { YamlData } from "@/utils/parseDynamicComponents";

const floatingStyle = {
  ...A4,
  width: `calc((100% - ${A4.width})/2)`
}

const Development = () => {
  const [content, setContent] = useState<YamlData>({});
  const [structure, setStructure] = useState<YamlData>({});
  const { update } = useDynamicComponents();
  const { toggleDebug } = useAppState();

  useEffect(() => {
    update({ ...structure, ...content });
  }, [content, structure]);

  return (
    <>
      <LateralElement>
        <div className="p-1 mb-1 bg-white">
          <Toggle onToggle={toggleDebug}><Bug /></Toggle>
        </div>
        <Editor onChange={setContent} title="content" />
      </LateralElement>
      <LateralElement side='right'>
        <Editor onChange={setStructure} title="structure" />
      </LateralElement>
    </>
  );
};

const LateralElement = ({ children, side = 'left' }: { children: React.ReactNode, side?: 'left' | 'right' }) => (
  < div className={cn(side === 'right' ? "right-0" : "", "fixed px-2 bottom-0 top-0")} style={floatingStyle} >
    {children}
  </div >
)

export default Development;



