import { useMemo, useState } from "react";
import { Textarea } from "./ui/textarea";
import { A4 } from "@/constants";
import createComponentBuilder from "@/utils/createComponentBuilder";
import { createElement } from 'react';
(window as any).createElement = createElement

const floatingStyle = {
  ...A4,
  width: `calc((100% - ${A4.width})/2)`
}

const Development = () => {
  const [style, setStyle] = useState('');
  const Box = useMemo(() => createComponentBuilder(`
Box:
  from: div
  class: bg-red-100 size-[20px]
  body: test

`), []);
  console.log(Box);
  return (
    <div>
      <div className="fixed px-2" style={floatingStyle}>
        <Textarea className="bg-white" />
      </div>
      <div className="fixed px-2 right-0" style={floatingStyle}>
        <Textarea className="bg-white" onChange={(e) => setStyle(e.target.value)} value={style} />
      </div>
      <Box />
    </div>
  );
};
export default Development;



