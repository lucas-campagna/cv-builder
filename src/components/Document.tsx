import { useEffect, useRef, useState } from "react";
import { A4 } from "@/constants";
import useAppState from "@/hooks/useAppState";
import useDynamicComponents from "@/hooks/useDynamicComponents";
import { renderToString } from "react-dom/server";

const [width, height] = [parseInt(A4.width), parseInt(A4.height)];
const a4Ratio = width / height;

const Document = () => {
  const { isDebugging } = useAppState();
  const { Document } = useDynamicComponents();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container?.children?.[0]) return;

    const updateScale = () => {
      const rect = container.children[0].getBoundingClientRect();
      const a4Ratio = width / height;
      const containerRatio = rect.width / rect.height;
      // console.log(width, height);
      // setScale(rect.width / a4Ratio);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [Document]);

  return (
    <div className="bg-white h-full w-full">
      <div
        ref={containerRef}
        className={`doc w-[${A4.width}] h-full`}
        style={{
          // width: A4.width,
          // height: '1000%',
          //   // width: A4.width,
          // transform: `scale(0.8)`,
          // transformOrigin: "top center",
        }}
        // dangerouslySetInnerHTML={{
        //   __html: renderToString(<Document />),
        // }}
      >
        {isDebugging ? (
          renderToString(<Document />)
        ) : (
          <Document className="bg-white overflow-y-scroll h-full" style={{transform: 'scale(1)'}} />
        )}
      </div>
    </div>
  );
};

export default Document;
