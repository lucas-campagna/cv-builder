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

function parseBody(body: unknown, finalProps: Record<string, unknown>, listOfComponents: ComponentBuilder): React.ReactNode {
  if (Array.isArray(body)) {
    return body.map((item: unknown, index: number) => {
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
        const childChildren = parseBody(childBody, childFinalProps, listOfComponents);
        if (listOfComponents[childFrom]) {
          return React.cloneElement(listOfComponents[childFrom](childFinalProps), { key: index });
        } else {
          return React.createElement(childFrom, { className: childProcessedClass, key: index, ...childFinalProps }, childChildren);
        }
      } else if (typeof item === 'object' && item !== null) {
        const { from: childFrom = 'div', style: childClass = '', body: childBody, ...childProps } = item as ComponentProperties & Record<string, unknown>;
        const childMergedProps = { ...childProps };
        const childFinalProps = Object.fromEntries(
          Object.entries(childMergedProps).map(([k, v]) => [
            k,
            typeof v === 'string' ? v.replace(varRegEx, (_, p1) => String(finalProps[p1] || '')) : v
          ])
        );
        const childProcessedClass = (childClass as string)?.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || '')) || '';
        const childChildren = parseBody(childBody, childFinalProps, listOfComponents);
        if (listOfComponents[childFrom]) {
          return React.cloneElement(listOfComponents[childFrom](childFinalProps), { key: index });
        } else {
          return React.createElement(childFrom, { className: childProcessedClass, key: index, ...childFinalProps }, childChildren);
        }
      } else {
        return item as React.ReactNode;
      }
    }) as React.ReactNode[];
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
    const childChildren = parseBody(childBody, childFinalProps, listOfComponents);
    if (listOfComponents[childFrom]) {
      return React.cloneElement(listOfComponents[childFrom](childFinalProps), { key: 0 });
    } else {
      return React.createElement(childFrom, { className: childProcessedClass, key: 0, ...childFinalProps }, childChildren);
    }
  } else if (typeof body === 'object' && body !== null) {
    // Body is object without 'from', treat as child with default 'div'
    const { style: childClass = '', body: childBody, ...childProps } = body as Record<string, unknown>;
    const childFrom = 'div';
    const childMergedProps = { ...childProps };
    const childFinalProps = Object.fromEntries(
      Object.entries(childMergedProps).map(([k, v]) => [
        k,
        typeof v === 'string' ? v.replace(varRegEx, (_, p1) => String(finalProps[p1] || '')) : v
      ])
    );
    const childProcessedClass = (childClass as string)?.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || '')) || '';
    const childChildren = parseBody(childBody, childFinalProps, listOfComponents);
    if (listOfComponents[childFrom]) {
      return React.cloneElement(listOfComponents[childFrom](childFinalProps), { key: 0 });
    } else {
      return React.createElement(childFrom, { className: childProcessedClass, key: 0, ...childFinalProps }, childChildren);
    }
  } else if (typeof body === 'string') {
    return body.replace(varRegEx, (_, p1) => String(finalProps[p1] || ''));
  }
  return null;
}

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
  const yamlData = yaml.load(yamlString) as Record<string, any> | undefined;
  const listOfComponents: ComponentBuilder = {};

  if (!yamlData) return {};
  // Handle duplicate keys by merging
  const componentMap = new Map<string, any>();
  for (const [key, value] of Object.entries(yamlData)) {
    if (componentMap.has(key)) {
      const existing = componentMap.get(key);
      if (Array.isArray(value)) {
        existing.body = value;
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(existing, value);
      }
    } else {
      componentMap.set(key, value);
    }
  }
  // Parse in reverse order to handle dependencies
  const entries = Array.from(componentMap).reverse();

  for (const [componentName, properties] of entries) {
    if (Array.isArray(properties)) {
      // Component is an array, treat as Fragment
      const componentFunc = (props: Record<string, unknown>) => {
        const children = properties.map((item: unknown, index: number) => {
          if (typeof item === 'object' && item !== null && 'from' in item) {
            const { from: childFrom, style: childClass = '', body: childBody, ...childProps } = item as ComponentProperties & Record<string, unknown>;
            const childMergedProps = { ...childProps, ...props };
            const childFinalProps = Object.fromEntries(
              Object.entries(childMergedProps).map(([k, v]) => [
                k,
                typeof v === 'string' ? v.replace(varRegEx, (_, p1) => String(childMergedProps[p1] || '')) : v
              ])
            );
            const childProcessedClass = (childClass as string)?.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || '')) || '';
            let childChildren: React.ReactNode = null;
            if (childBody) {
              if (typeof childBody === 'string') {
                childChildren = childBody.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || ''));
              } else if (Array.isArray(childBody)) {
                childChildren = childBody as React.ReactNode;
              }
            }
            if (listOfComponents[childFrom]) {
              return React.cloneElement(listOfComponents[childFrom](childFinalProps), { key: index });
            } else {
              return React.createElement(childFrom, { className: childProcessedClass, key: index, ...childFinalProps }, childChildren);
            }
          } else if (typeof item === 'object' && item !== null) {
            const { from: childFrom = 'div', style: childClass = '', body: childBody, ...childProps } = item as ComponentProperties & Record<string, unknown>;
            const childMergedProps = { ...childProps, ...props };
            const childFinalProps = Object.fromEntries(
              Object.entries(childMergedProps).map(([k, v]) => [
                k,
                typeof v === 'string' ? v.replace(varRegEx, (_, p1) => String(childMergedProps[p1] || '')) : v
              ])
            );
            const childProcessedClass = (childClass as string)?.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || '')) || '';
            let childChildren: React.ReactNode = null;
            if (childBody) {
              if (typeof childBody === 'string') {
                childChildren = childBody.replace(varRegEx, (_, p1) => String(childFinalProps[p1] || ''));
              } else if (Array.isArray(childBody)) {
                childChildren = childBody as React.ReactNode;
              }
            }
            if (listOfComponents[childFrom]) {
              return React.cloneElement(listOfComponents[childFrom](childFinalProps), { key: index });
            } else {
              return React.createElement(childFrom, { className: childProcessedClass, key: index, ...childFinalProps }, childChildren);
            }
          } else {
            return item as React.ReactNode;
          }
        });
        return React.createElement(React.Fragment, {}, children);
      };
      listOfComponents[componentName] = componentFunc;
    } else {
      // Normal object component
      const { from, style: className, body, ...otherProps } = properties as ComponentProperties & Record<string, unknown>;
      const elementFrom = from || 'div';

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
          children = parseBody(body, finalProps, listOfComponents);
        }

        if (listOfComponents[elementFrom]) {
          return listOfComponents[elementFrom](finalProps);
        } else {
          return React.createElement(elementFrom, { ...elementProps, className: processedClass }, children);
        }
      };

      listOfComponents[componentName] = componentFunc;
    }
  }

  return listOfComponents;
}

export default parseDynamicComponent;