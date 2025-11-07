import {
  Tooltip as TootipBase,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Tooltip({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: string;
}) {
  return (
    <TootipBase>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </TootipBase>
  );
}

export default Tooltip;
