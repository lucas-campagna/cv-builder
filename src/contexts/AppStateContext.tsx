import { createContext, useState } from "react";

export const AppStateContext = createContext({
  onePage: true,
  isDebugging: false,
  toggleDebug: () => { },
  toggleOnePage: () => { },
})


function AppStateContextProvider({ children }: { children: React.ReactNode }) {
  const [onePage, setOnePage] = useState(true);
  const [isDebugging, setIsDebuggin] = useState(false);
  const toggleDebug = () => setIsDebuggin((v: boolean) => !v);
  const toggleOnePage = () => setOnePage((v: boolean) => !v);
  return (
    <AppStateContext.Provider value={{ onePage, isDebugging, toggleDebug, toggleOnePage}}>
      {children}
    </AppStateContext.Provider>
  );
}

export default AppStateContextProvider;
