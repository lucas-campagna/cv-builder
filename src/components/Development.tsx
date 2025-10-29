import { useEffect, useState } from "react";
import { A4 } from "@/constants";
import Editor from "./Editor";
import { cn } from "@/lib/utils";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { Bug } from "lucide-react";
import Toggle from "./Toggle";
import useAppState from "@/hooks/useAppState";

const floatingStyle = {
  ...A4,
  width: `calc((100% - ${A4.width})/2)`
}

const Development = () => {
  const [content, setContent] = useState('');
  const [structure, setStructure] = useState('');
  const { update } = useDynamicComponents();
  const { toggleDebug } = useAppState();

  useEffect(() => {
    const code = `${structure}\n${content}`;
    update(code);
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
  < div className={cn(side === 'right' ? "right-0" : "", "fixed px-2")} style={floatingStyle} >
    {children}
  </div >
)

export default Development;



