import parseTemplate from "./templateParser";
import parseFrom from "./fromParser";
import parseBody from "./bodyParser";
import parseProps from "./propsParser";
import type { ComponentProps, PropsType, SetOfComponents } from "./types";
import { normalizeAll } from "./normalizer";

const build = (
  name: string,
  components: SetOfComponents = {}
): ((_: PropsType) => ComponentProps) => {
  const normalizedComponents = normalizeAll(components);
  let target: ComponentProps = normalizedComponents[name];
  if (!target) {
    return () => ({});
  }
  target = parseTemplate(name, normalizedComponents);
  target = parseFrom(target, normalizedComponents);
  target = parseBody(target, normalizedComponents);
  return (props: PropsType) => parseProps(target, props);
};

export default build;
