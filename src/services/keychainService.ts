import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes para las llaves del keychain
const KEYCHAIN_KEYS = {
  APP_CONFIG: 'app_config',
  USER_CREDENTIALS: 'user_credentials',
} as const;

const BIOMETRICS_KEY = 'biometricsEnabled';

// Interfaz para los datos de configuración de la app
export interface AppConfigData {
  apiBaseUrl: string;
  userId: string;
  token: string;
  refreshToken?: string;
  organizationId?: string;
  clientId?: string;
  clientSecret?: string;
  environment?: 'production' | 'staging' | 'development';
  expiresAt?: string; // ISO string
  lastLoginDate?: string;
  // Campos originales del QR
  TokenAplicacion?: string;
  IdUsuario?: string;
  NombreUsuario?: string;
  NombreCompleto?: string;
  ImgUsuario?: string;
  ColorPrimario?: string;
  UrlSwagger?: string;
}

// Interfaz para credenciales de usuario
export interface UserCredentials {
  username: string;
  password: string;
}

class KeychainService {
  /**
   * Limpia solo las credenciales de usuario
   */
  async clearUserCredentials(): Promise<boolean> {
    try {
      await Keychain.resetInternetCredentials({ server: KEYCHAIN_KEYS.USER_CREDENTIALS });
      return true;
    } catch (error) {
      console.error('Error clearing user credentials from keychain:', error);
      return false;
    }
  }
  /**
   * Guarda credenciales de usuario en el Keychain genérico (para biometría)
   */
  async saveGenericCredentials(credentials: UserCredentials): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(
        credentials.username,
        credentials.password,
        {
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
        }
      );
      return true;
    } catch (error) {
      console.error('Error saving generic credentials to keychain:', error);
      return false;
    }
  }
  /**
   * Guarda la configuración de la app en el keychain (guarda el objeto original del QR)
   */
  async saveAppConfig(config: any): Promise<boolean> {
    try {
      // Si el objeto tiene un campo __originalQR, guardar ese, si no, guardar el objeto tal cual
      const original = config && config.__originalQR ? config.__originalQR : config;
      const configString = JSON.stringify(original);
      await Keychain.setInternetCredentials(
        KEYCHAIN_KEYS.APP_CONFIG,
        'app_config',
        configString,
        {
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
        }
      );
      return true;
    } catch (error) {
      console.error('Error saving app config to keychain:', error);
      return false;
    }
  }

  /**
   * Lee la configuración de la app desde el keychain
   */
  async getAppConfig(): Promise<AppConfigData | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(KEYCHAIN_KEYS.APP_CONFIG);
      if (credentials && credentials.password) {
        const config = JSON.parse(credentials.password) as AppConfigData;
        return config;
      }
      return null;
    } catch (error) {
      console.error('Error reading app config from keychain:', error);
      return null;
    }
  }

  /**
   * Verifica si la configuración ha expirado
   */
  isConfigExpired(config: AppConfigData): boolean {
    if (!config.expiresAt) {
      return false; // Si no tiene fecha de expiración, no ha expirado
    }
    
    const expirationDate = new Date(config.expiresAt);
    const currentDate = new Date();
    
    return currentDate > expirationDate;
  }

  /**
   * Valida que la configuración tenga los campos mínimos requeridos y que provenga de un QR válido.
   * Solo son obligatorios: TokenAplicacion, NombreUsuario y UrlSwagger.
   */
  validateAppConfig(config: any): config is AppConfigData {
    return (
      config &&
      typeof config.TokenAplicacion === 'string' && config.TokenAplicacion.trim() !== '' &&
      typeof config.NombreUsuario === 'string' && config.NombreUsuario.trim() !== '' &&
      typeof config.UrlSwagger === 'string' && config.UrlSwagger.trim() !== ''
    );
  }

  // --- NUEVO: Flag biométrico en AsyncStorage ---

  /**
   * Guarda el estado de la biometría (activada/desactivada)
   */
  async setBiometricsEnabled(enabled: boolean): Promise<boolean> {
    try {
      await AsyncStorage.setItem(BIOMETRICS_KEY, enabled ? 'true' : 'false');
      return true;
    } catch (error) {
      console.error('Error saving biometrics state to AsyncStorage:', error);
      return false;
    }
  }

  /**
   * Lee el estado de la biometría
   */
  async getBiometricsEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(BIOMETRICS_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error reading biometrics state from AsyncStorage:', error);
      return false;
    }
  }

  // --- FIN NUEVO ---

  /**
   * Guarda credenciales de usuario
   */
  async saveUserCredentials(credentials: UserCredentials): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        KEYCHAIN_KEYS.USER_CREDENTIALS,
        credentials.username,
        credentials.password,
        {
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
        }
      );
      return true;
    } catch (error) {
      console.error('Error saving user credentials to keychain:', error);
      return false;
    }
  }

  /**
   * Lee credenciales de usuario
   */
  async getUserCredentials(): Promise<UserCredentials | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(KEYCHAIN_KEYS.USER_CREDENTIALS);
      if (credentials) {
        return {
          username: credentials.username,
          password: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.error('Error reading user credentials from keychain:', error);
      return null;
    }
  }

  /**
   * Limpia todos los datos del keychain y el flag biométrico
   */
  async clearAll(): Promise<boolean> {
    try {
      await Promise.all([
        Keychain.resetInternetCredentials({ server: KEYCHAIN_KEYS.APP_CONFIG }),
        Keychain.resetInternetCredentials({ server: KEYCHAIN_KEYS.USER_CREDENTIALS }),
        AsyncStorage.removeItem(BIOMETRICS_KEY),
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing keychain data:', error);
      return false;
    }
  }

  /**
   * Limpia solo la configuración de la app
   */
  async clearAppConfig(): Promise<boolean> {
    try {
      await Keychain.resetInternetCredentials({ server: KEYCHAIN_KEYS.APP_CONFIG });
      return true;
    } catch (error) {
      console.error('Error clearing app config from keychain:', error);
      return false;
    }
  }
}

export const keychainService = new KeychainService();
export default keychainService;
