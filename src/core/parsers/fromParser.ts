import type { ComponentProps, SetOfComponents } from "./types";
import parseProps from "./propsParser";
import { buildCoreComponent as build } from "./componentBuilder";

const parse = (
  target: ComponentProps,
  components: SetOfComponents = {}
): ComponentProps => {
  let { from, ...props } = target;
  if (!from || !components[from]) {
    return target;
  }
  const templated = build(from, components);
  return parse(
    {
      body: target.body,
      style: target.style,
      ...parseProps(templated, { ...components[from], ...props }),
      from: templated.from,
    },
    components
  );
};

export default parse;
