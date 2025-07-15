import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos para los datos de configuración
export interface AppConfigData {
  serverUrl: string;
  apiKey: string;
  organizationId: string;
  userId: string;
  sessionToken: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
  environment: 'development' | 'production' | 'staging';
  lastLoginDate: string;
}

// Constantes para las keys de almacenamiento
export const STORAGE_KEYS = {
  APP_CONFIG: 'app_config',
  USER_PREFERENCES: 'user_preferences',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LAST_LOGIN: 'last_login',
} as const;

// Clase para manejar el almacenamiento local
export class StorageManager {
  
  /**
   * Guardar datos de configuración de la app
   */
  static async saveAppConfig(data: AppConfigData): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(STORAGE_KEYS.APP_CONFIG, jsonData);
      console.log('App config saved successfully');
    } catch (error) {
      console.error('Error saving app config:', error);
      throw error;
    }
  }

  /**
   * Obtener datos de configuración de la app
   */
  static async getAppConfig(): Promise<AppConfigData | null> {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.APP_CONFIG);
      if (jsonData) {
        return JSON.parse(jsonData) as AppConfigData;
      }
      return null;
    } catch (error) {
      console.error('Error getting app config:', error);
      return null;
    }
  }

  /**
   * Guardar un dato específico
   */
  static async saveData(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`Data saved for key: ${key}`);
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Obtener un dato específico
   */
  static async getData(key: string): Promise<any | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Eliminar un dato específico
   */
  static async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Data removed for key: ${key}`);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Limpiar todos los datos
   */
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  /**
   * Verificar si existe un dato
   */
  static async hasData(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking data for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Obtener todas las keys almacenadas
   */
  static async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Guardar configuración del usuario
   */
  static async saveUserPreferences(preferences: any): Promise<void> {
    try {
      await this.saveData(STORAGE_KEYS.USER_PREFERENCES, preferences);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  /**
   * Obtener configuración del usuario
   */
  static async getUserPreferences(): Promise<any | null> {
    try {
      return await this.getData(STORAGE_KEYS.USER_PREFERENCES);
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  /**
   * Guardar estado de biometría
   */
  static async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await this.saveData(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled);
    } catch (error) {
      console.error('Error saving biometric state:', error);
      throw error;
    }
  }

  /**
   * Obtener estado de biometría
   */
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await this.getData(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return enabled === true;
    } catch (error) {
      console.error('Error getting biometric state:', error);
      return false;
    }
  }

  /**
   * Guardar datos del último login
   */
  static async saveLastLogin(userData: any): Promise<void> {
    try {
      const loginData = {
        ...userData,
        timestamp: new Date().toISOString(),
      };
      await this.saveData(STORAGE_KEYS.LAST_LOGIN, loginData);
    } catch (error) {
      console.error('Error saving last login:', error);
      throw error;
    }
  }

  /**
   * Obtener datos del último login
   */
  static async getLastLogin(): Promise<any | null> {
    try {
      return await this.getData(STORAGE_KEYS.LAST_LOGIN);
    } catch (error) {
      console.error('Error getting last login:', error);
      return null;
    }
  }
}

// Funciones de utilidad para datos específicos
export const AppStorage = {
  // Guardar datos iniciales de la app
  async initializeApp(configData: AppConfigData): Promise<void> {
    await StorageManager.saveAppConfig(configData);
  },

  // Verificar si la app está configurada
  async isAppConfigured(): Promise<boolean> {
    const config = await StorageManager.getAppConfig();
    return config !== null;
  },

  // Obtener configuración completa
  async getFullConfig(): Promise<AppConfigData | null> {
    return await StorageManager.getAppConfig();
  },

  // Actualizar un campo específico de la configuración
  async updateConfigField(field: keyof AppConfigData, value: any): Promise<void> {
    const currentConfig = await StorageManager.getAppConfig();
    if (currentConfig) {
      currentConfig[field] = value;
      await StorageManager.saveAppConfig(currentConfig);
    }
  },

  // Limpiar datos de la app
  async reset(): Promise<void> {
    await StorageManager.clearAllData();
  },
};
