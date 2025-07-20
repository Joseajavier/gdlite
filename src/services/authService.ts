// authService.ts

import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';

// Puedes añadir otros métodos según necesites para tu login, tokens, etc.

// Comprueba si el dispositivo soporta biometría (Face ID o Touch ID)
export async function canUseBiometrics(): Promise<boolean> {
  try {
    const supported = await Keychain.getSupportedBiometryType();
    // Devuelve true si soporta algún tipo de biometría
    return !!supported;
  } catch (e) {
    console.warn('[authService] Error comprobando biometría:', e);
    return false;
  }
}

// Lanza el prompt de Face ID / Touch ID usando react-native-biometrics
export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available } = await rnBiometrics.isSensorAvailable();
    if (!available) {
      console.warn('[authService] No hay sensor biométrico disponible');
      return false;
    }
    const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Autenticación necesaria para acceder' });
    if (success) {
      console.log('[authService] Prompt biométrico mostrado y autenticación OK');
      return true;
    } else {
      console.warn('[authService] Prompt biométrico cancelado o fallido');
      return false;
    }
  } catch (e) {
    console.warn('[authService] Error usando biometría:', e);
    return false;
  }
}

// Ejemplo genérico para login normal (puedes adaptarlo a tu backend)
export async function login(user: string, password: string): Promise<boolean> {
  // Aquí tu lógica real de autenticación, por ejemplo contra una API REST
  // Por ahora es solo un placeholder
  if (user === 'admin' && password === 'admin') {
    // Guardar credenciales en el Keychain si quieres login automático/biométrico
    await Keychain.setGenericPassword(user, password);
    return true;
  }
  return false;
}

export const authService = {
  canUseBiometrics,
  authenticateWithBiometrics,
  login,
};
