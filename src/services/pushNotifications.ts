// Handler para notificaciones en segundo plano (debe estar fuera de cualquier componente)
import messaging from '@react-native-firebase/messaging';

// Este handler debe estar en el nivel raíz del proyecto
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Mensaje recibido en segundo plano:', remoteMessage);
});
import { Alert } from 'react-native';

// Solicitar permisos al usuario para notificaciones push
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Permiso para notificaciones:', authStatus);
    getFcmToken();
  } else {
    Alert.alert('Permiso denegado', 'No podrás recibir notificaciones push');
  }
}

// Obtener el token FCM del dispositivo

export async function getFcmToken(): Promise<string | null> {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('FCM Token:', fcmToken);
    // Aquí puedes enviar el token a tu backend si lo necesitas
    return fcmToken;
  }
  return null;
}

// Escuchar notificaciones en primer plano
export function listenForMessages() {
  messaging().onMessage(async remoteMessage => {
    Alert.alert('Notificación recibida', JSON.stringify(remoteMessage.notification));
  });
}
