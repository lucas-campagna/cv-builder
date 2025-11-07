import type { ComponentProps, SetOfComponents } from "./types";
import parseFrom from "./fromParser";
import { isHtmlTag } from "./utils";
import { buildCoreComponent as build } from "./componentBuilder";
import { normalize } from "./normalizer";

const generateName = () => crypto.randomUUID();

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
    const parsedBody = body.map((b) => {
      const name = generateName();
      return build(name, {
        ...components,
        [name]: typeof b === "string" ? { body: b } : (b as ComponentProps),
      });
    });
    return {
      ...target,
      body: normalize(parsedBody, components).body,
    };
  }
  if (typeof body === "object" && body !== null) {
    const name = generateName();
    return {
      ...target,
      body: build(name, {
        ...components,
        [name]: body as ComponentProps,
      }),
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
