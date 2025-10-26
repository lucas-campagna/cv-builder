import * as yaml from 'js-yaml';
import { type JSX } from 'react';

interface ComponentProperties {
  from?: string;
  class?: string;
  body?: string;
}

interface ComponentBuilder {
  [key: string]: (props: Record<string, any>) => JSX.Element;
}

function createComponentBuilder(yamlString: string): ComponentBuilder {
  const yamlData = yaml.load(yamlString) as Record<string, ComponentProperties[]>;
  const listOfComponents: ComponentBuilder = {};

  for (const [componentName, properties] of Object.entries(yamlData)) {
    const props: Partial<ComponentProperties> = {};
    console.log(componentName, properties)
    // if (Array.isArray(properties)) {
    //   properties.forEach(prop => {
    //     Object.assign(props, prop);
    //   });
    // }

    const { from, class: className, body } = properties as ComponentProperties;

    // Extract variables from class and body
    const variables = new Set<string>();
    const extractVars = (str: string) => {
      const matches = str.match(/\$(\w+)/g);
      if (matches) matches.forEach(match => variables.add(match.slice(1)));
    };
    if (className) extractVars(className);
    if (body) extractVars(body);

    // Generate className with interpolation
    const processedClass = className ? className.replace(/\$(\w+)/g, '${$1}') : '';

    // Generate body with interpolation
    const processedBody = body ? body.replace(/\$(\w+)/g, '{$1}') : '';

    // Generate component code
    const varList = Array.from(variables).join(', ');
    const componentCode = `(${varList ? `{${varList}` : ''}) => createElement("${from}", { className:"${processedClass} "}, "${processedBody}")`;
    console.log(componentCode)

    // listOfComponents[componentName] = new Function(varList, `return ${componentCode}`)() as (props: Record<string, any>) => JSX.Element;
    listOfComponents[componentName] = eval(componentCode);
  }

  return listOfComponents;
}

export default createComponentBuilder;
