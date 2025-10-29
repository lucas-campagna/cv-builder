import parseDynamicComponent, { type YamlData } from "@/utils/parseDynamicComponents";
import React, { createContext, useCallback, useState, Component } from "react";

type TDynamicComponents = {
  Cv: React.FC;
  update: (_: YamlData) => void;
};

const Cv: React.FC = () => <>No CV</>;
const defaultDynamicComponents: TDynamicComponents = {
  Cv,
  update: (_: YamlData) => { },
};

class ErrorBoundary extends Component<{ fallback: React.FC; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: React.FC; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CV render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <this.props.fallback />;
    }
    return this.props.children;
  }
}

export const DynamicComponents = createContext(defaultDynamicComponents);

export default function DynamicComponentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentCv, setCurrentCv] = useState<React.FC>(() => Cv);
  const [previousWorkingCv, setPreviousWorkingCv] = useState<React.FC>(() => Cv);
  const update = useCallback((yamlData: YamlData) => {
    setPreviousWorkingCv(() => currentCv);
    try {
      const newComponents = parseDynamicComponent(yamlData) ?? {};
      const newCv = (newComponents.cv ?? Cv) as React.FC;
      setCurrentCv(() => () => React.createElement(ErrorBoundary, { fallback: previousWorkingCv, children: React.createElement(newCv) }));
    } catch {
      // keep current
    }
  }, [currentCv, previousWorkingCv]);

  return (
    <DynamicComponents.Provider value={{ Cv: currentCv, update }}>
      {children}
    </DynamicComponents.Provider>
  );
}
