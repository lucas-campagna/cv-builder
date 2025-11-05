import type { ComponentProps, SetOfComponents } from "./types";
import parseFrom from "./fromParser";
import { isHtmlTag } from "./utils";

const parse = (
  target: ComponentProps,
  components: SetOfComponents = {}
): ComponentProps => {
  const isComponent = (name: string) => components[name] !== undefined;
  if (typeof target === "string") {
    if (isComponent(target)) {
      return parseFrom({ from: target }, components);
    } else if (isHtmlTag(target)) {
      return { from: target };
    } else {
      return { body: target };
    }
  }
  const { body } = target;
  if (!body) {
    return parseFrom(target, components);
  }
  if (Array.isArray(body)) {
    const parsedBody = body.map((b) => parse(b, components));
    return {
      ...target,
      body: parsedBody,
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
