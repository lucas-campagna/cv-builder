import { createContext, useState } from "react";

export const AppStateContext = createContext({
  isDebugging: false,
  toggleDebug: () => { },
})


function AppStateContextProvider({ children }: { children: React.ReactNode }) {
  const [isDebugging, setIsDebuggin] = useState(false);
  const toggleDebug = () => setIsDebuggin((v: boolean) => !v);
  return (
    <AppStateContext.Provider value={{ isDebugging, toggleDebug }}>
      {children}
    </AppStateContext.Provider>
  );
}

export default AppStateContextProvider;
