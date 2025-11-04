import type { ComponentProps, PropsType } from "./types";

const varRegEx = /\$(\w+)/g;
const parse = (
  target: ComponentProps,
  values: PropsType = {}
): ComponentProps => {
  const isPureVariable = (str: string) => {
    const match = str.match(varRegEx);
    return match && match[0] === str;
  };
  const usedKeys = new Set();
  const parse = <T>(target: T): T =>
    typeof target === "string"
      ? isPureVariable(target)
        ? (() => {
            if (values[target.substring(1)]) usedKeys.add(target.substring(1));
            return values[target.substring(1)] as T;
          })()
        : (target.replace(varRegEx, (_, p1) => {
            if (values[p1]) usedKeys.add(p1);
            const value = String(values[p1] || "");
            return value.startsWith("$")
              ? (parse(value) as string)
              : value ?? "";
          }) as T)
      : Array.isArray(target)
      ? (target.map(parse) as T)
      : target && typeof target === "object"
      ? (Object.fromEntries(
          Object.entries(target).map(([k, v]) => [k, parse(v)])
        ) as T)
      : target;
  const parsedTarget = parse(target);
  const unusedKeys = Object.fromEntries(
    Object.entries(values).filter(([k]) => !usedKeys.has(k))
  );
  return {
    // TODO: Not sure about unusedKeys here
    ...unusedKeys,
    ...parsedTarget,
  };
};

export default parse;
