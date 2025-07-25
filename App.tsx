
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SessionProvider } from './src/context/SessionContext';
import { PendingSignaturesProvider } from './src/context/PendingSignaturesContext';


const App: React.FC = () => {
  return (
    <PendingSignaturesProvider>
      <SessionProvider>
        <AppNavigator />
      </SessionProvider>
    </PendingSignaturesProvider>
  );
};

export default App;
