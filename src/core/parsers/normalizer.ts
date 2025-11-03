import { isHtmlTag } from "./utils";
import type { ComponentProps, SetOfComponents } from "./types";

export const normalize = (
  target: any,
  components: RawSetOfComponents = {}
): ComponentProps => {
  const parsedComponents = parseArrayOfComponents(components);
  if (Array.isArray(target)) {
    return {
      body: target
        .filter(Boolean)
        .map((item) => normalize(item, parsedComponents)),
    };
  }
  const isComponent = (name: string) => parsedComponents[name] !== undefined;
  if (
    typeof target === "string" &&
    (isComponent(target) || isHtmlTag(target))
  ) {
    return { from: target };
  }
  if (typeof target === "object" && target !== null) {
    if (target.body) {
      const parsedBody = normalize(target.body, parsedComponents);
      return {
        ...target,
        body: parsedBody?.body ?? parsedBody,
      };
    }
    if (target.from) return target;
    const from = Object.keys(target).find(
      (key) => isComponent(key) || isHtmlTag(key)
    );
    const parsedTarget = { ...target };
    if (from) {
      parsedTarget.body = normalize(parsedTarget[from], parsedComponents);
      parsedTarget.from = from;
    }
    return parsedTarget;
  }
  return { body: target };
};

type RawSetOfComponents = SetOfComponents | { [key: string]: ComponentProps[] };
type NormalizeAll = (components: RawSetOfComponents) => SetOfComponents;
export const normalizeAll: NormalizeAll = (components) => {
  return Object.fromEntries(
    Object.entries(components).map(([key, value]) => [
      key,
      normalize(value, parseArrayOfComponents(components)),
    ])
  );
};

const parseArrayOfComponents = (
  components: RawSetOfComponents
): SetOfComponents =>
  Object.fromEntries(
    Object.entries(components).map(([key, body]) => [
      key,
      body,
      Array.isArray(components) ? { body } : body,
    ])
  );
