import type { ComponentProps, SetOfComponents } from "./types";
import parseProps from "./propsParser";

const parse = (
  target: ComponentProps,
  components: SetOfComponents = {}
): ComponentProps => {
  let { from, ...props } = target;
  if (!from || !components[from]) {
    return target;
  }
  return parse(
    {
      ...parseProps(components[from], props),
      from: components[from].from,
    },
    components
  );
};

export default parse;
