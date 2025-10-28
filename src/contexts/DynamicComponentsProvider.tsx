import parseDynamicComponent, { type ComponentBuilder } from "@/utils/parseDynamicComponents";
import { createContext, useState, type JSX } from "react";

type TComponents = ComponentBuilder;
type TDynamicComponents = {
  components: TComponents;
  parse: (_: string) => void;
};

const defaultDynamicComponents: TDynamicComponents = {
  components: {},
  parse: (_: string) => { },
};

const DynamicComponents = createContext(defaultDynamicComponents);

export default function DynamicComponentsProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [components, setComponents] = useState(
    defaultDynamicComponents.components
  );
  const parse = (code: string) => setComponents(parseDynamicComponent(code));
  return (
    <DynamicComponents.Provider value={{ components, parse }}>
      {children}
    </DynamicComponents.Provider>
  );
}
