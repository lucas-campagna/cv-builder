import type { ComponentProps, SetOfComponents } from "./types";
import parseProps from "./propsParser";
import { buildCoreComponent as build } from "./componentBuilder";

const parse = (
  target: ComponentProps,
  components: SetOfComponents = {}
): ComponentProps => {
  let { from, ...props } = target;
  if (!from) return target;
  const componentName = components[from] ? from : components["$" + from] ? "$" + from : null;
  if (!componentName) return target;
  const templated = build(componentName, components);
  return parse(
    {
      body: target.body,
      style: target.style,
      ...parseProps(templated, { ...components[componentName], ...props }),
      from: templated.from,
    },
    components
  );
};

export default parse;
