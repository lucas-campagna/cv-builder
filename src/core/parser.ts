import * as yaml from "js-yaml";
import React from "react";
import { varRegEx } from "./parsers/utils";

export type Root = Record<string, any>;
type PropertyType =
  | string
  | {
      body?: PropertyType | PropertyType[] | React.ReactNode;
      from?: string;
      style?: string;
      [key: string]: unknown;
    };

// interface ComponentProperties {
//   from: string;
//   style?: string;
//   body?: unknown;
// }
type ComponentBuilder = (props?: PropertyType) => React.ReactNode;

const createElement = React.createElement;

const normalizeProps = (props?: PropertyType): Exclude<PropertyType, string> =>
  typeof props === "string" ? { body: props } : props ?? {};

const buildPropertiesParser = (props: PropertyType | undefined) => {
  if (!props)
    return {
      getUnusedVars: () => ({}),
      parse: (target: unknown) => target,
    };
  const parsedProps = normalizeProps(props);
  const appliedVars = new Set<string>();
  const parse = (target: unknown): unknown =>
    typeof target === "string"
      ? target.replace(varRegEx, (_, p1) => {
          appliedVars.add(p1);
          const value = String(parsedProps[p1] || "");
          return value.startsWith("$") ? (parse(value) as string) : value ?? "";
        })
      : Array.isArray(target)
      ? target.map(parse)
      : target && typeof target === "object"
      ? Object.fromEntries(
          Object.entries(target).map(([k, v]) => [k, parse(v)])
        )
      : target;
  return {
    getUnusedVars: () =>
      Object.fromEntries(
        Object.entries(parsedProps).filter(([k]) => !appliedVars.has(k))
      ),

    parse,
  };
};

export default function parse(root: Root | string | undefined) {
  const listOfComponents: Record<string, ComponentBuilder> = {};
  const templates: Record<string, unknown> = {};
  const queueOfComponentsToProcess: string[] = [];

  if (typeof root === "string") {
    root = yaml.load(root) as Record<string, any> | undefined;
  }
  if (!root) return {};

  const getTemplate = (name?: string): unknown | undefined =>
    templates[name || ""];

  const applyTemplate = <T = PropertyType>(
    name: string,
    properties: T | T[]
  ): T | T[] => {
    if (Array.isArray(properties)) {
      return properties.map((props) => applyTemplate(name, props)) as T[];
    }
    let parsedProps = properties;
    for (
      let templateCount = 0, template = undefined;
      (template = getTemplate("$".repeat(templateCount) + name));
      templateCount++
    ) {
      const propertiesParser = buildPropertiesParser(
        parsedProps as PropertyType
      );
      parsedProps = propertiesParser.parse(parsedProps) as any;
      parsedProps = propertiesParser.getUnusedVars() as any;
    }

    return parsedProps;
  };

  for (const [name, properties] of Object.entries(root)) {
    if (name.startsWith("$")) {
      const templateName = name.slice(1);
      templates[templateName] =
        generateComponent({
          name: templateName,
          properties,
        }) || ((() => ({})) as ComponentBuilder);
      delete root[name];
    } else {
      queueOfComponentsToProcess.push(name);
    }
  }

  function generateComponent({
    name,
    properties,
    index: key,
  }: {
    name?: string;
    properties: PropertyType | PropertyType[];
    index?: number;
  }): ComponentBuilder | undefined {
    if (name) properties = applyTemplate(name, properties);
    if (Array.isArray(properties)) {
      const filteredProperties = properties.filter(Boolean);
      return (props?: PropertyType) =>
        createElement(
          React.Fragment,
          {},
          filteredProperties
            .map((properties: PropertyType, index: number) =>
              generateComponent({
                properties,
                index,
              })?.(props)
            )
            .filter(Boolean)
        ) as React.ReactNode;
    }
    properties = normalizeProps(properties);

    let createElementFunction = createElement;
    let {
      from,
      style: className,
      body,
      ...otherProps
    }: Exclude<PropertyType, string> = properties;

    if (from) {
      if (queueOfComponentsToProcess.includes(from)) getComponent(from);
      if (listOfComponents[from]) {
        return (props?: PropertyType) =>
          listOfComponents[from]({
            ...otherProps,
            ...normalizeProps(props),
            key,
          });
        // from = listOfComponents[from]();
        // createElementFunction = cloneElement as unknown as typeof createElement;
      }
    } else if (!body) {
      const componentsName = Object.keys(otherProps).filter(
        (key) => key in (root as Root)
      );
      if (componentsName.length > 0) {
        return (props?: PropertyType) =>
          createElement(
            React.Fragment,
            {},
            componentsName.map((from, index) =>
              generateComponent({
                properties: {
                  from,
                  ...normalizeProps(otherProps[from] as PropertyType),
                },
                index,
              })?.(props)
            )
          ) as React.ReactNode;
      }
    }

    return (props?: PropertyType): React.ReactNode => {
      const propertiesParser = buildPropertiesParser(props);
      const classNameInstance = (
        propertiesParser.parse(className) as string | undefined
      )
        ?.split(/\s+/)
        ?.filter(Boolean)
        ?.join(" ");
      const bodyInstance = propertiesParser.parse(body) as
        | PropertyType
        | PropertyType[]
        | undefined;
      props = propertiesParser.getUnusedVars();
      if (!from && typeof bodyInstance === "string") {
        root = root as Root;
        if (root[bodyInstance]) {
          return getComponent(bodyInstance)?.(props);
        }
        return bodyInstance;
      }
      return createElementFunction(
        from ?? "div",
        {
          className: classNameInstance,
          ...props,
          key,
        },
        Array.isArray(bodyInstance)
          ? generateComponent({ properties: bodyInstance })?.({ ...props, key })
          : bodyInstance && typeof bodyInstance === "object"
          ? generateComponent({ properties: bodyInstance as PropertyType })?.({
              ...props,
              key,
            })
          : bodyInstance
      );
    };
  }

  let countUnprocessedNames = 0;
  function getComponent(name?: string) {
    countUnprocessedNames++;
    if (!root) return;
    root = root as Root;
    while (!name && queueOfComponentsToProcess.length > 0) {
      name ||= queueOfComponentsToProcess.pop();
    }
    if (!name) return;
    if (listOfComponents[name]) return listOfComponents[name];
    const properties = root[name];
    const component = generateComponent({ name, properties });
    if (!component) {
      queueOfComponentsToProcess.unshift(name);
      return;
    }
    countUnprocessedNames = 0;
    listOfComponents[name] = component;
    // delete root[name];
  }

  // Process queued comps
  while (queueOfComponentsToProcess.length > 0) {
    if (countUnprocessedNames >= queueOfComponentsToProcess.length) {
      throw new Error(
        "Could not process the following components: " +
          queueOfComponentsToProcess.join(", ")
      );
    }
    getComponent();
  }
  return listOfComponents;
}
