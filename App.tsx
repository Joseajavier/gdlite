
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SessionProvider } from './src/context/SessionContext';


const App: React.FC = () => {
  return (
    <SessionProvider>
      <AppNavigator />
    </SessionProvider>
  );
};

export default App;
