import Document from './components/Document';
import Development from './components/Development';
import DynamicComponentsProvider from './contexts/DynamicComponentsProvider';
import AppStateContextProvider from './contexts/AppStateContext';

const App = () => (
  <div className="bg-gray-700/50 py-2">
    <DynamicComponentsProvider>
      <AppStateContextProvider>
        <Development />
        <Document />
      </AppStateContextProvider>
    </DynamicComponentsProvider>
  </div>
);

export default App;
