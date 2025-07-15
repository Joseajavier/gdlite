import * as Keychain from 'react-native-keychain';

// Constantes para las llaves del keychain
const KEYCHAIN_KEYS = {
  APP_CONFIG: 'app_config',
  BIOMETRICS_ENABLED: 'biometrics_enabled',
  USER_CREDENTIALS: 'user_credentials',
} as const;

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
}

// Interfaz para credenciales de usuario
export interface UserCredentials {
  username: string;
  password: string;
}

class KeychainService {
  /**
   * Guarda la configuración de la app en el keychain
   */
  async saveAppConfig(config: AppConfigData): Promise<boolean> {
    try {
      const configString = JSON.stringify(config);
      await Keychain.setInternetCredentials(
        KEYCHAIN_KEYS.APP_CONFIG,
        'app_config',
        configString
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
   * Valida que la configuración tenga los campos mínimos requeridos
   */
  validateAppConfig(config: any): config is AppConfigData {
    return (
      config &&
      typeof config.apiBaseUrl === 'string' &&
      typeof config.userId === 'string' &&
      typeof config.token === 'string' &&
      config.apiBaseUrl.trim() !== '' &&
      config.userId.trim() !== '' &&
      config.token.trim() !== ''
    );
  }

  /**
   * Guarda el estado de la biometría (activada/desactivada)
   */
  async setBiometricsEnabled(enabled: boolean): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        KEYCHAIN_KEYS.BIOMETRICS_ENABLED,
        'biometrics',
        enabled.toString()
      );
      return true;
    } catch (error) {
      console.error('Error saving biometrics state to keychain:', error);
      return false;
    }
  }

  /**
   * Lee el estado de la biometría
   */
  async getBiometricsEnabled(): Promise<boolean> {
    try {
      const credentials = await Keychain.getInternetCredentials(KEYCHAIN_KEYS.BIOMETRICS_ENABLED);
      if (credentials && credentials.password) {
        return credentials.password === 'true';
      }
      return false;
    } catch (error) {
      console.error('Error reading biometrics state from keychain:', error);
      return false;
    }
  }

  /**
   * Guarda credenciales de usuario
   */
  async saveUserCredentials(credentials: UserCredentials): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        KEYCHAIN_KEYS.USER_CREDENTIALS,
        credentials.username,
        credentials.password
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
   * Limpia todos los datos del keychain
   */
  async clearAll(): Promise<boolean> {
    try {
      await Promise.all([
        Keychain.resetInternetCredentials({ server: KEYCHAIN_KEYS.APP_CONFIG }),
        Keychain.resetInternetCredentials({ server: KEYCHAIN_KEYS.BIOMETRICS_ENABLED }),
        Keychain.resetInternetCredentials({ server: KEYCHAIN_KEYS.USER_CREDENTIALS }),
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
