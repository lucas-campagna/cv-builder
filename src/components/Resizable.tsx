import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React from "react";

const Resizable = ({
  areas,
  ...props
}: {
  areas: React.ReactNode[];
} & React.ComponentProps<typeof ResizablePanelGroup>) => {
  return (
    <ResizablePanelGroup {...props}>
      {areas.map((area, index) => (
        <>
          <ResizablePanel key={index}>{area}</ResizablePanel>
          {index !== areas.length - 1 && <ResizableHandle />}
        </>
      ))}
    </ResizablePanelGroup>
  );
};

export default Resizable;
