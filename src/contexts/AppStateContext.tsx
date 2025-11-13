import { createContext, useState } from "react";

const appStateDefaultValues = {
  fontSize: 12,
  onePage: true,
  isDebugging: false,
  toggleDebug: () => {},
  toggleOnePage: () => {},
  setFontSize: (_: number) => {},
};

export const AppStateContext = createContext(appStateDefaultValues);

function AppStateContextProvider({ children }: { children: React.ReactNode }) {
  const [onePage, setOnePage] = useState(appStateDefaultValues.onePage);
  const [isDebugging, setIsDebugging] = useState(
    appStateDefaultValues.isDebugging
  );
  const [fontSize, setFontSize] = useState(appStateDefaultValues.fontSize);
  const toggleDebug = () => setIsDebugging((v: boolean) => !v);
  const toggleOnePage = () => setOnePage((v: boolean) => !v);
  return (
    <AppStateContext.Provider
      value={{
        onePage,
        isDebugging,
        fontSize,
        toggleDebug,
        toggleOnePage,
        setFontSize,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export default AppStateContextProvider;
