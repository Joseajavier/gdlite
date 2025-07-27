
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SessionProvider } from './src/context/SessionContext';
import { PendingSignaturesProvider } from './src/context/PendingSignaturesContext';
import { AvisosProvider } from './src/context/AvisosContext';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <PendingSignaturesProvider>
          <AvisosProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AvisosProvider>
        </PendingSignaturesProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
};

export default App;
