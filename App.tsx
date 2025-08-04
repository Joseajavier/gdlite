import React, { useEffect } from 'react';
import { Alert } from 'react-native'; // ← AÑADIDO
import messaging from '@react-native-firebase/messaging';
import AppNavigator from './src/navigation/AppNavigator';
import { SessionProvider } from './src/context/SessionContext';
import { PendingSignaturesProvider } from './src/context/PendingSignaturesContext';
import { AvisosProvider } from './src/context/AvisosContext';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { sendTokenToBackend } from './src/api/devices'; // ← AÑADIDO: tu función de API

const App: React.FC = () => {
  useEffect(() => {
    // 1) Solicita permiso a notificaciones
    messaging()
      .requestPermission()
      .then(authStatus => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!enabled) {
          console.log('Permiso de notificaciones denegado');
          return;
        }

        // 2) Obtén el token FCM
        messaging()
          .getToken()
          .then(token => {
            console.log('🔑 FCM token:', token);
            // 3) Envía el token al backend
            sendTokenToBackend(token);
          });
      });

    // 4) Maneja notificaciones en primer plano
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title ?? 'Notificación',
        remoteMessage.notification?.body ?? ''
      );
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

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
