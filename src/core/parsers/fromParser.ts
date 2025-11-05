import type { ComponentProps, SetOfComponents } from "./types";
import parseProps from "./propsParser";
import parseTemplate from "./templateParser";

const parse = (
  target: ComponentProps,
  components: SetOfComponents = {}
): ComponentProps => {
  let { from, ...props } = target;
  if (!from || !components[from]) {
    return target;
  }
  const templated = parseTemplate(from, components);
  return parse(
    {
      ...parseProps(templated, { ...components[from], ...props }),
      from: templated.from,
    },
    components
  );
};

export default parse;
