import type { ComponentProps } from "./types";

const render = ({
  from,
  style,
  body,
  ...props
}: ComponentProps): string => {
  const hasAnyProp =
    !!from ||
    !!style ||
    Object.keys(props).filter((p) => p !== "key").length > 0;
  if (!hasAnyProp && typeof body !== "object") {
    return String(body || "");
  }
  const type = hasAnyProp ? from ?? "div" : "fragment";
  const properties = hasAnyProp
    ? {
        className: style,
        ...props,
      }
    : {};
  const children =
    typeof body === "object"
      ? (Array.isArray(body) ? body : [body])
          .filter(Boolean)
          .map((body: any, index: number) =>
            render(
              typeof body === "object"
                ? { ...body, key: index }
                : { body, key: index }
            )
          )
          .join("")
      : (body ? String(body) : "");
  if (type === "fragment") {
    return children;
  }
  const attrs = Object.entries(properties)
    .filter(([key, value]) => key !== "key" && value != null)
    .map(([key, value]) => {
      const attr = key === "className" ? "class" : key;
      const escapedValue = String(value).replace(/"/g, '&quot;');
      return `${attr}="${escapedValue}"`;
    })
    .join(" ");
  const attrsStr = attrs ? ` ${attrs}` : "";
  return `<${type}${attrsStr}>${children}</${type}>`;
};

export default render;
