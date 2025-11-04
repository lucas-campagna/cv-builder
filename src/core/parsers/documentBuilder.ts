import buildComponent from "./componentBuilder";
import parseYaml from "./yamlParser";
import render from "./renderer";
import type { PropsType } from "./types";
import type React from "react";

const build = (
  code: string,
  entry: string = "document"
): ((_: PropsType) => React.ReactNode) => {
  const component = buildComponent(entry, parseYaml(code) || {});
  return (props) => render(component(props));
};

export default build;
