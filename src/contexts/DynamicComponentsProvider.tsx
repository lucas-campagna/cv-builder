import parseDynamicComponent, { type ComponentBuilder } from "@/utils/parseDynamicComponents";
import { createContext, useState, type JSX } from "react";

type TDynamicComponents = {
  Cv: () => JSX.Element;
  update: (_: string) => void;
};

const Cv = () => <>No CV</>;
const defaultDynamicComponents: TDynamicComponents = {
  Cv,
  update: (_: string) => { },
};

export const DynamicComponents = createContext(defaultDynamicComponents);

export default function DynamicComponentsProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [components, setComponents] = useState<ComponentBuilder>({});
  const [previousWorkingCv, setPreviousWorkingCv] = useState(() => <Cv />);
  const update = (code: string) => {
    if (!code) return;
    try {
      const newComponents = parseDynamicComponent(code) ?? {};
      try {
        const CvNew = newComponents.cv ?? Cv;
        setPreviousWorkingCv(() => <CvNew />);
      } catch {
        newComponents.cv = Cv;
      }
      setComponents(newComponents);
    } catch { }
  };

  return (
    <DynamicComponents.Provider value={{ Cv: components.cv ?? Cv, update }}>
      {children}
    </DynamicComponents.Provider>
  );
}
