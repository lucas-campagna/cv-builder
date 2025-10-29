import { useEffect, useState, type JSX } from "react";
import { A4 } from "@/constants";
import Editor from "./Editor";
import { cn } from "@/lib/utils";
import useDynamicComponents from "@/hooks/useDynamicComponents";

const floatingStyle = {
  ...A4,
  width: `calc((100% - ${A4.width})/2)`
}

const Development = () => {
  const [content, setContent] = useState('');
  const [structure, setStructure] = useState('');
  const { update } = useDynamicComponents();

  useEffect(() => {
    const code = `${structure}\n${content}`;
    update(code);
  }, [content, structure]);

  return (
    <>
      <LateralElement>
        <Editor onChange={setContent} title="content" />
      </LateralElement>
      <LateralElement side='right'>
        <Editor onChange={setStructure} title="structure" />
      </LateralElement>
    </>
  );
};

const LateralElement = ({ children, side = 'left' }: { children: JSX.Element, side?: 'left' | 'right' }) => (
  < div className={cn(side === 'right' ? "right-0" : "", "fixed px-2")} style={floatingStyle} >
    {children}
  </div >
)

export default Development;



