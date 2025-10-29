import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { memo } from "react";

type Editor = React.ComponentProps<"textarea"> & {
  onChange: (text: string) => void;
  title?: string;
}
const Editor = ({ onChange, className, title, ...props }: Editor) => (
  <div className="bg-white h-[calc(100vh-20px)] flex flex-col rounded-sm ">
    {title &&
      <div className="text-muted-foreground px-1 focus-visible:border-0 focus-visible:ring-ring-0 focus-visible:ring-0">{title}</div>}
    <Textarea
      {...props}
      className={cn("bg-white h-[100%] resize-none border-0", className)}
      onChange={(e: any) => onChange(e.target.value)}
    />
  </div>
);

export default memo(Editor);
