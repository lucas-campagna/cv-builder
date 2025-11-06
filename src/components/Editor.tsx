import { memo } from "react";
import YamlEditor from "@focus-reactive/react-yaml";
import type { YamlData } from "@/utils/parseDynamicComponents";

type Editor = {
  initialText: string;
  onChange: (_: YamlData) => void;
};
const Editor = ({ initialText, onChange }: Editor) => (
  <div className="h-full flex flex-col">
    <YamlEditor text={initialText} onChange={({ json }) => onChange(json)} />
  </div>
);

export default memo(Editor);
