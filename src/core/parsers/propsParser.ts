import type { ComponentProps, PropsType } from "./types";
import { varRegEx } from "./utils";

const parse = (
  target: ComponentProps,
  values: PropsType = {}
): ComponentProps => {
  const isPureVariable = (str: string) => {
    const match = str.match(varRegEx);
    return match && match[0] === str;
  };
  const parse = <T>(target: T): T =>
    typeof target === "string"
      ? isPureVariable(target)
        ? (values[target.substring(1)] as T)
        : (target.replace(varRegEx, (_, p1) => {
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
  return parse(target);
};

export default parse;
