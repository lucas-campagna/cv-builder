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
        <ResizablePanelItem
          area={area}
          key={index}
          last={index < areas.length - 1}
        />
      ))}
    </ResizablePanelGroup>
  );
};

const ResizablePanelItem = ({
  area,
  last,
}: {
  area: React.ReactNode;
  last: boolean;
}) => (
  <>
    <ResizablePanel>{area}</ResizablePanel>
    {last && <ResizableHandle />}
  </>
);

export default Resizable;
