import { createContext, useState } from "react";

export const AppStateContext = createContext({
  fontSize: 14,
  onePage: true,
  isDebugging: false,
  toggleDebug: () => { },
  toggleOnePage: () => { },
  setFontSize: (_: number) => {}
})


function AppStateContextProvider({ children }: { children: React.ReactNode }) {
  const [onePage, setOnePage] = useState(true);
  const [isDebugging, setIsDebuggin] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const toggleDebug = () => setIsDebuggin((v: boolean) => !v);
  const toggleOnePage = () => setOnePage((v: boolean) => !v);
  return (
    <AppStateContext.Provider value={{ onePage, isDebugging, fontSize, toggleDebug, toggleOnePage, setFontSize }}>
      {children}
    </AppStateContext.Provider>
  );
}

export default AppStateContextProvider;
