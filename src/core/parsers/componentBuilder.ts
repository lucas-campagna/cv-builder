import parseTemplate from "./templateParser";
import parseFrom from "./fromParser";
import parseBody from "./bodyParser";
import parseProps from "./propsParser";
import type { ComponentProps, PropsType, SetOfComponents } from "./types";
import { normalizeAll } from "./normalizer";

const build = (
  name: string,
  components: SetOfComponents = {}
): ((_?: PropsType) => ComponentProps) => {
  const normalizedComponents = normalizeAll(components);
  const target = buildCoreComponent(name, normalizedComponents);
  return (props) => parseProps(target, props);
};

export const buildCoreComponent = (
  name: string,
  components: SetOfComponents = {}
): ComponentProps => {
  let target: ComponentProps = components[name];
  if (!target) {
    return {};
  }
  target = parseTemplate(name, components);
  target = parseFrom(target, components);
  target = parseBody(target, components);
  return target;
};

export default build;
