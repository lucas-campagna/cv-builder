import type { ComponentProps, SetOfComponents } from "./types";
import parseFrom from "./fromParser";
import { isHtmlTag } from "./utils";

const parse = (
  target: ComponentProps,
  components: SetOfComponents = {}
): ComponentProps => {
  const isComponent = (name: string) => components[name] !== undefined;
  const { body } = target;
  if (!body) {
    return parseFrom(target, components);
  }
  if (Array.isArray(body)) {
    return {
      ...target,
      body: body.map((b) => parse(b, components)),
    };
  }
  if (typeof body === "object" && body !== null) {
    return {
      ...target,
      body: parse(body as ComponentProps, components),
    };
  }
  if (typeof body === "string" && (isComponent(body) || isHtmlTag(body))) {
    const parsedBody = isComponent(body)
      ? parseFrom(components[body], components)
      : { from: body };
    return {
      ...target,
      ...parsedBody,
    };
  }
  return target;
};

export default parse;
