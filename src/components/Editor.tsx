import { memo } from "react";
import YamlEditor from "@focus-reactive/react-yaml";
import type { YamlData } from "@/utils/parseDynamicComponents";

type Editor = Omit<React.ComponentProps<"textarea">, 'onChange'> & {
  onChange: (_: YamlData) => void;
  title?: string;
}
const Editor = ({ onChange, title }: Editor) => {
  return (
    <div className="bg-white h-[calc(100vh-20px)] flex flex-col rounded-sm ">
      {title &&
        <div className="text-muted-foreground px-1 focus-visible:border-0 focus-visible:ring-ring-0 focus-visible:ring-0">{title}</div>}
      <YamlEditor
        onChange={({ json }) => onChange(json)}
      />
    </div>
  )
};

export default memo(Editor);
