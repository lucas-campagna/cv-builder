import buildComponent from "./componentBuilder";
import parseYaml from "./yamlParser";
import render from "./renderer";
import type { PropsType, SetOfComponents } from "./types";

const build = (
  code: string | SetOfComponents,
  entry: string = "document"
): ((_?: PropsType) => string) => {
  const component = buildComponent(
    entry,
    typeof code === "string" ? parseYaml(code) : code || {}
  );
  return (props) => render(component(props));
};

export default build;
