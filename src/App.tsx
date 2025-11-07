import Document from "./components/Document";
import EditorPanel from "./components/EditorPanel";
import DynamicComponentsProvider from "./contexts/DynamicComponentsProvider";
import AppStateContextProvider from "./contexts/AppStateContext";
import Resizable from "./components/Resizable";

const App = () => (
  <DynamicComponentsProvider>
    <AppStateContextProvider>
      <Resizable
        className="fixed bg-gray-700/50 h-screen flex w-screen overflow-hidden"
        direction="horizontal"
        areas={[<EditorPanel />, <Document />]}
      />
    </AppStateContextProvider>
  </DynamicComponentsProvider>
);

export default App;
