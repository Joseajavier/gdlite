
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SessionProvider } from './src/context/SessionContext';
import { PendingSignaturesProvider } from './src/context/PendingSignaturesContext';
import { AvisosProvider } from './src/context/AvisosContext';
import { NavigationContainer } from '@react-navigation/native';


const App: React.FC = () => {
  return (
    <SessionProvider>
      <PendingSignaturesProvider>
        <AvisosProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AvisosProvider>
      </PendingSignaturesProvider>
    </SessionProvider>
  );
};

export default App;
