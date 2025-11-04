import React, { createElement } from "react";
import type { ComponentProps } from "./types";

const render = ({
  from,
  style,
  body,
  ...props
}: ComponentProps): React.ReactNode => {
  const hasAnyProp =
    !!from ||
    !!style ||
    Object.keys(props).filter((p) => p !== "key").length > 0;
  if (!hasAnyProp && typeof body !== "object") {
    return body as React.ReactNode;
  }
  const type = hasAnyProp ? from ?? "div" : React.Fragment;
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
      : (body as React.ReactNode);
  return createElement(type, properties, children);
};

export default render;
