import parseProps from "./propsParser";
import parseBody from "./bodyParser";
import parseFrom from "./fromParser";
import type { ComponentProps, SetOfComponents } from "./types";

const parse = (name: string, components: SetOfComponents): ComponentProps => {
  const templateName = "$" + name;
  const target = components[name];
  const template = components[templateName];
  if (!template) {
    return target ?? {};
  }
  if (!target) {
    return template;
  }
  let parsedTemplate = parseProps(
    Object.fromEntries(
      Object.entries(template).map(([key, value]) => [
        key,
        target[key] ?? value,
      ])
    ),
    target
  );
  const result = parseBody(parsedTemplate, components) as ComponentProps;
  return parseFrom(
    {
      ...parse(templateName, {
        ...components,
        [templateName]: result,
      }),
      ...result,
    },
    components
  );
};

export default parse;
