import * as yaml from 'js-yaml';
import * as React from 'react';
import { type JSX } from 'react';

interface ComponentProperties {
  from: string;
  style?: string;
  body?: unknown;
}
export interface ComponentBuilder {
  [key: string]: (props: Record<string, unknown>) => JSX.Element;
}

const varRegEx = /\$(\w+)/g;

function extractVars(obj: unknown): Set<string> {
  const vars = new Set<string>();
  function scan(value: unknown) {
    if (typeof value === 'string') {
      const matches = value.match(varRegEx);
      if (matches) {
        matches.forEach(m => vars.add(m.slice(1)));
      }
    } else if (Array.isArray(value)) {
      value.forEach(scan);
    } else if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach(scan);
    }
  }
  scan(obj);
  return vars;
}

function parseDynamicComponent(yamlString: string): ComponentBuilder {
  const yamlData = yaml.load(yamlString) as Record<string, ComponentProperties>;
  const listOfComponents: ComponentBuilder = {};

  // Parse in reverse order to handle dependencies (assuming dependents come before dependencies in YAML)
  const entries = Object.entries(yamlData).reverse();

  for (const [componentName, properties] of entries) {
    const { from, style: className, body, ...otherProps } = properties as ComponentProperties & Record<string, unknown>;

    const componentFunc = (props: Record<string, unknown>) => {
      const mergedProps = { ...otherProps, ...props };
      const finalProps = Object.fromEntries(
        Object.entries(mergedProps).map(([k, v]) => [
          k,
          typeof v === 'string' ? v.replace(varRegEx, (_, p1) => String(mergedProps[p1] || '')) : v
        ])
      );
      const processedClass = className?.replace(varRegEx, (_, p1) => String(finalProps[p1] || '')) || '';

      const usedVars = extractVars(properties);
      const elementProps = Object.fromEntries(Object.entries(finalProps).filter(([k]) => !usedVars.has(k)));

      let children: React.ReactNode = null;
      if (body) {
        if (Array.isArray(body)) {
          children = ((body as unknown[]).map((item: unknown, index: number) => {
            if (typeof item === 'object' && item !== null && 'from' in item) {
              const { from: childFrom, style: childClass = '', body: childBody, ...childProps } = item as ComponentProperties & Record<string, unknown>;
              const childMergedProps = { ...childProps };
              const childFinalProps = Object.fromEntries(
                Object.entries(childMergedProps).map(([k, v]) => [
                  k,
                  typeof v === 'string' ? v.replace(varRegEx, (_, p1) => String(finalProps[p1] || '')) : v
                ])
              );
              const childProcessedClass = (childClass as string)?.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || '')) || '';
              let childChildren: React.ReactNode = null;
              if (childBody) {
                if (typeof childBody === 'string') {
                  childChildren = childBody.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || ''));
                } else if (Array.isArray(childBody)) {
                  // For simplicity, handle recursively if needed
                  childChildren = childBody as React.ReactNode;
                }
              }
              if (listOfComponents[childFrom]) {
                return React.cloneElement(listOfComponents[childFrom](childFinalProps), { key: index });
              } else {
                return React.createElement(childFrom, { className: childProcessedClass, key: index }, childChildren);
              }
            } else {
              return item as React.ReactNode;
            }
          })) as React.ReactNode[];
        } else if (typeof body === 'object' && body !== null && 'from' in body) {
          const { from: childFrom, style: childClass = '', body: childBody, ...childProps } = body as ComponentProperties & Record<string, unknown>;
          const childMergedProps = { ...childProps };
          const childFinalProps = Object.fromEntries(
            Object.entries(childMergedProps).map(([k, v]) => [
              k,
              typeof v === 'string' ? v.replace(varRegEx, (_, p1) => String(finalProps[p1] || '')) : v
            ])
          );
          const childProcessedClass = (childClass as string)?.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || '')) || '';
          let childChildren: React.ReactNode = null;
          if (childBody) {
            if (typeof childBody === 'string') {
              childChildren = childBody.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || ''));
            } else if (Array.isArray(childBody)) {
              // For simplicity, handle recursively if needed
              childChildren = childBody as React.ReactNode;
            }
          }
          if (listOfComponents[childFrom]) {
            children = React.cloneElement(listOfComponents[childFrom](childFinalProps), { key: 0 });
          } else {
            children = React.createElement(childFrom, { className: childProcessedClass, key: 0 }, childChildren);
          }
        } else if (typeof body === 'string') {
          children = body.replace(varRegEx, (_, p1) => String(finalProps[p1] || ''));
        }
      }

      if (listOfComponents[from!]) {
        return listOfComponents[from!](finalProps);
      } else {
        return React.createElement(from!, { ...elementProps, className: processedClass }, children);
      }
    };

    listOfComponents[componentName] = componentFunc;
  }

  return listOfComponents;
}

export default parseDynamicComponent;
