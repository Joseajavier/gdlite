/**
 * API para gestión de dispositivos y tokens FCM
 */

import { Platform } from 'react-native';
import { StorageManager } from '../utils/storage';

export interface DeviceTokenData {
  token: string;
  deviceType: 'ios' | 'android';
  appVersion?: string;
  deviceModel?: string;
  osVersion?: string;
}

/**
 * Envía el token FCM al backend
 */
export const sendTokenToBackend = async (token: string): Promise<void> => {
  try {
    // Obtener configuración del app (URL del servidor, etc.)
    const config = await StorageManager.getAppConfig();
    
    if (!config?.serverUrl) {
      console.warn('⚠️ No hay URL del servidor configurada. Token FCM no enviado.');
      return;
    }

    const deviceData: DeviceTokenData = {
      token,
      deviceType: Platform.OS as 'ios' | 'android',
      // Puedes añadir más datos del dispositivo si es necesario
    };

    const response = await fetch(`${config.serverUrl}/api/devices/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.sessionToken}`,
      },
      body: JSON.stringify(deviceData),
    });

    if (response.ok) {
      console.log('✅ Token FCM enviado al backend correctamente');
    } else {
      console.error('❌ Error al enviar token FCM:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Error al enviar token FCM al backend:', error);
  }
};

/**
 * Función para registrar un dispositivo con información adicional
 */
export const registerDevice = async (deviceInfo: Partial<DeviceTokenData>): Promise<void> => {
  try {
    const config = await StorageManager.getAppConfig();
    
    if (!config?.serverUrl) {
      console.warn('⚠️ No hay URL del servidor configurada');
      return;
    }

    const response = await fetch(`${config.serverUrl}/api/devices/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.sessionToken}`,
      },
      body: JSON.stringify(deviceInfo),
    });

    if (response.ok) {
      console.log('✅ Dispositivo registrado correctamente');
    } else {
      console.error('❌ Error al registrar dispositivo:', response.status);
    }
  } catch (error) {
    console.error('❌ Error al registrar dispositivo:', error);
  }
};
