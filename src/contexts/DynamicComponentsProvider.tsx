import buildDocument from "@/core/parsers/documentBuilder";
import type { YamlData } from "@/utils/parseDynamicComponents";
import React, { createContext, useCallback, useState, Component } from "react";

type TDynamicComponents = {
  Document: React.FC;
  update: (_: YamlData) => void;
};

const DEFAULT_DOCUMENT: React.FC = () => <>No Document</>;
const defaultDynamicComponents: TDynamicComponents = {
  Document: DEFAULT_DOCUMENT,
  update: (_: YamlData) => {},
};

class ErrorBoundary extends Component<
  { fallback: React.FC; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.FC; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Document render error:", error, errorInfo);
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
  const [currentDocument, setCurrentDocument] = useState<React.FC>(
    () => DEFAULT_DOCUMENT
  );
  const [previousWorkingCv, setPreviousWorkingCv] = useState<React.FC>(
    () => currentDocument
  );
  const update = useCallback(
    (yamlData: YamlData) => {
      setPreviousWorkingCv(() => currentDocument);
      try {
        const newComponent = buildDocument(yamlData as any);
        setCurrentDocument(
          () => () =>
            React.createElement(ErrorBoundary, {
              fallback: previousWorkingCv,
              children: <div dangerouslySetInnerHTML={{ __html: newComponent() }} />,
            })
        );
      } catch {
        // keep current
      }
    },
    [currentDocument, previousWorkingCv]
  );

  return (
    <DynamicComponents.Provider value={{ Document: currentDocument, update }}>
      {children}
    </DynamicComponents.Provider>
  );
}
