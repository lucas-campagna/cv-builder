import buildDocument from "@/core/parsers/documentBuilder";
import React, { createContext, useCallback, useState, Component } from "react";

type TDynamicComponents = {
  Document: React.FC<{props?: any}>;
  update: (_: string) => void;
};

const DEFAULT_DOCUMENT: React.FC = () => <>No Document</>;
const defaultDynamicComponents: TDynamicComponents = {
  Document: DEFAULT_DOCUMENT,
  update: (_: string) => {},
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
    (yamlData: string) => {
      setPreviousWorkingCv(() => currentDocument);
      try {
        const newComponent = buildDocument(yamlData);
        setCurrentDocument(
          () => (props?: any) =>
            React.createElement(ErrorBoundary, {
              fallback: previousWorkingCv,
              children: <div {...props} dangerouslySetInnerHTML={{ __html: newComponent() }} />,
            })
        );
      } catch(e) {
        // keep current
        console.error(e);
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
