// authService.ts

import * as Keychain from 'react-native-keychain';

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

// Lanza el prompt de Face ID / Touch ID usando las credenciales guardadas
export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    // Comprobar si hay credenciales guardadas antes de lanzar el prompt
    const hasCredentials = await Keychain.getGenericPassword();
    if (!hasCredentials) {
      console.warn('[authService] No hay credenciales guardadas en el Keychain genérico.');
      // Opcional: puedes mostrar un mensaje al usuario aquí si lo llamas desde la UI
      return false;
    }
    // Lanzar el prompt de biometría (forzar FaceID/TouchID)
    const credentials = await Keychain.getGenericPassword({
      authenticationPrompt: {
        title: 'Iniciar sesión con biometría',
        subtitle: 'Autentícate para acceder',
        description: '',
        cancel: 'Cancelar',
      },
      authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
    });
    if (credentials) {
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

// Si tienes más métodos propios, déjalos aquí debajo:

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
