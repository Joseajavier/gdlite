import { useState, useEffect, useCallback } from 'react';
import { StorageManager, AppConfigData } from '../utils/storage';

// Hook para manejar la configuración de la app
export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const savedConfig = await StorageManager.getAppConfig();
      setConfig(savedConfig);
      setError(null);
    } catch (err) {
      setError('Error loading configuration');
      console.error('Error loading config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: AppConfigData) => {
    try {
      await StorageManager.saveAppConfig(newConfig);
      setConfig(newConfig);
      setError(null);
      return true;
    } catch (err) {
      setError('Error saving configuration');
      console.error('Error saving config:', err);
      return false;
    }
  };

  const updateConfig = async (updates: Partial<AppConfigData>) => {
    if (!config) return false;
    
    const updatedConfig = { ...config, ...updates };
    return await saveConfig(updatedConfig);
  };

  const clearConfig = async () => {
    try {
      await StorageManager.removeData('app_config');
      setConfig(null);
      setError(null);
      return true;
    } catch (err) {
      setError('Error clearing configuration');
      console.error('Error clearing config:', err);
      return false;
    }
  };

  const isConfigured = config !== null;

  return {
    config,
    isLoading,
    error,
    isConfigured,
    saveConfig,
    updateConfig,
    clearConfig,
    reloadConfig: loadConfig,
  };
};

// Hook para manejar datos generales del storage
export const useStorage = (key: string, defaultValue: any = null) => {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedData = await StorageManager.getData(key);
      setData(savedData || defaultValue);
      setError(null);
    } catch (err) {
      setError(`Error loading data for key: ${key}`);
      console.error(`Error loading data for key ${key}:`, err);
      setData(defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveData = async (newData: any) => {
    try {
      await StorageManager.saveData(key, newData);
      setData(newData);
      setError(null);
      return true;
    } catch (err) {
      setError(`Error saving data for key: ${key}`);
      console.error(`Error saving data for key ${key}:`, err);
      return false;
    }
  };

  const removeData = async () => {
    try {
      await StorageManager.removeData(key);
      setData(defaultValue);
      setError(null);
      return true;
    } catch (err) {
      setError(`Error removing data for key: ${key}`);
      console.error(`Error removing data for key ${key}:`, err);
      return false;
    }
  };

  const hasData = data !== null && data !== defaultValue;

  return {
    data,
    isLoading,
    error,
    hasData,
    saveData,
    removeData,
    reloadData: loadData,
  };
};

// Hook para manejar preferencias del usuario
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const savedPreferences = await StorageManager.getUserPreferences();
      setPreferences(savedPreferences || {});
      setError(null);
    } catch (err) {
      setError('Error loading preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: any) => {
    try {
      await StorageManager.saveUserPreferences(newPreferences);
      setPreferences(newPreferences);
      setError(null);
      return true;
    } catch (err) {
      setError('Error saving preferences');
      console.error('Error saving preferences:', err);
      return false;
    }
  };

  const updatePreference = async (key: string, value: any) => {
    const updatedPreferences = { ...preferences, [key]: value };
    return await savePreferences(updatedPreferences);
  };

  const getPreference = (key: string, defaultValue: any = null) => {
    return preferences[key] ?? defaultValue;
  };

  return {
    preferences,
    isLoading,
    error,
    savePreferences,
    updatePreference,
    getPreference,
    reloadPreferences: loadPreferences,
  };
};

// Hook para manejar el estado de biometría
export const useBiometricSettings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBiometricSettings();
  }, []);

  const loadBiometricSettings = async () => {
    try {
      setIsLoading(true);
      const enabled = await StorageManager.isBiometricEnabled();
      setIsEnabled(enabled);
      setError(null);
    } catch (err) {
      setError('Error loading biometric settings');
      console.error('Error loading biometric settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setBiometricEnabled = async (enabled: boolean) => {
    try {
      await StorageManager.setBiometricEnabled(enabled);
      setIsEnabled(enabled);
      setError(null);
      return true;
    } catch (err) {
      setError('Error saving biometric settings');
      console.error('Error saving biometric settings:', err);
      return false;
    }
  };

  return {
    isEnabled,
    isLoading,
    error,
    setBiometricEnabled,
    reloadSettings: loadBiometricSettings,
  };
};

// Hook para manejar datos del último login
export const useLastLogin = () => {
  const [lastLogin, setLastLogin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLastLogin();
  }, []);

  const loadLastLogin = async () => {
    try {
      setIsLoading(true);
      const savedLogin = await StorageManager.getLastLogin();
      setLastLogin(savedLogin);
      setError(null);
    } catch (err) {
      setError('Error loading last login');
      console.error('Error loading last login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLastLogin = async (loginData: any) => {
    try {
      await StorageManager.saveLastLogin(loginData);
      setLastLogin(loginData);
      setError(null);
      return true;
    } catch (err) {
      setError('Error saving last login');
      console.error('Error saving last login:', err);
      return false;
    }
  };

  return {
    lastLogin,
    isLoading,
    error,
    saveLastLogin,
    reloadLastLogin: loadLastLogin,
  };
};
