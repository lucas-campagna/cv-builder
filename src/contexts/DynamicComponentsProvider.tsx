import parseDynamicComponent, { type ComponentBuilder } from "@/utils/parseDynamicComponents";
import { createContext, useState, type JSX } from "react";

type TComponents = ComponentBuilder;
type TDynamicComponents = {
  components: TComponents;
  update: (_: string) => void;
};

const defaultDynamicComponents: TDynamicComponents = {
  components: {},
  update: (_: string) => { },
};

export const DynamicComponents = createContext(defaultDynamicComponents);

export default function DynamicComponentsProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [components, setComponents] = useState(
    defaultDynamicComponents.components
  );
  const update = (code: string) => code && setComponents(parseDynamicComponent(code));
  return (
    <DynamicComponents.Provider value={{ components, update }}>
      {children}
    </DynamicComponents.Provider>
  );
}
