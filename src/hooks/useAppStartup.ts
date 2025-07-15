import { useEffect, useState, useCallback } from 'react';
import { keychainService, AppConfigData } from '../services/keychainService';
import { authService, BiometricAuthResult } from '../services/authService';

export enum AppStartupState {
  LOADING = 'LOADING',
  NEED_QR_CONFIG = 'NEED_QR_CONFIG',
  NEED_BIOMETRIC_AUTH = 'NEED_BIOMETRIC_AUTH',
  NEED_LOGIN = 'NEED_LOGIN',
  AUTHENTICATED = 'AUTHENTICATED',
  ERROR = 'ERROR',
}

export interface AppStartupResult {
  state: AppStartupState;
  config?: AppConfigData;
  error?: string;
  biometricType?: string;
  canUseBiometrics?: boolean;
}

export interface UseAppStartupOptions {
  skipBiometrics?: boolean;
  onStateChange?: (state: AppStartupState) => void;
}

export const useAppStartup = (options: UseAppStartupOptions = {}) => {
  const [result, setResult] = useState<AppStartupResult>({
    state: AppStartupState.LOADING,
  });

  const { skipBiometrics = false, onStateChange } = options;

  const updateState = useCallback((newState: AppStartupState, additionalData?: Partial<AppStartupResult>) => {
    const newResult = {
      ...result,
      state: newState,
      ...additionalData,
    };
    setResult(newResult);
    onStateChange?.(newState);
  }, [result, onStateChange]);

  const checkAppConfiguration = useCallback(async (): Promise<AppConfigData | null> => {
    try {
      console.log('🔍 Checking app configuration...');
      const config = await keychainService.getAppConfig();
      
      if (!config) {
        console.log('❌ No configuration found');
        return null;
      }

      if (!keychainService.validateAppConfig(config)) {
        console.log('❌ Invalid configuration format');
        await keychainService.clearAppConfig();
        return null;
      }

      if (keychainService.isConfigExpired(config)) {
        console.log('⏰ Configuration expired');
        await keychainService.clearAppConfig();
        return null;
      }

      console.log('✅ Valid configuration found');
      return config;
    } catch (error) {
      console.error('Error checking app configuration:', error);
      return null;
    }
  }, []);

  const checkBiometricAuthentication = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔐 Checking biometric authentication...');
      
      const biometricsEnabled = await keychainService.getBiometricsEnabled();
      if (!biometricsEnabled) {
        console.log('❌ Biometrics not enabled');
        return false;
      }

      const canUseBiometrics = await authService.canUseBiometrics();
      if (!canUseBiometrics) {
        console.log('❌ Biometrics not available');
        return false;
      }

      console.log('🔐 Attempting biometric authentication...');
      const authResult: BiometricAuthResult = await authService.authenticateWithBiometrics(
        'Usa tu biometría para acceder a la aplicación'
      );

      if (authResult.success) {
        console.log('✅ Biometric authentication successful');
        return true;
      } else {
        console.log('❌ Biometric authentication failed:', authResult.error);
        return false;
      }
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return false;
    }
  }, []);

  const performStartupFlow = useCallback(async () => {
    try {
      updateState(AppStartupState.LOADING);

      // 1. Verificar configuración de la app
      const config = await checkAppConfiguration();
      
      if (!config) {
        updateState(AppStartupState.NEED_QR_CONFIG);
        return;
      }

      // 2. Si hay configuración válida, verificar biometría (si no está deshabilitada)
      if (!skipBiometrics) {
        const biometricsEnabled = await keychainService.getBiometricsEnabled();
        const canUseBiometrics = await authService.canUseBiometrics();
        
        if (biometricsEnabled && canUseBiometrics) {
          updateState(AppStartupState.NEED_BIOMETRIC_AUTH, { 
            config,
            canUseBiometrics: true 
          });
          
          const biometricSuccess = await checkBiometricAuthentication();
          
          if (biometricSuccess) {
            updateState(AppStartupState.AUTHENTICATED, { config });
            return;
          } else {
            // Si falla la biometría, ir al login manual
            updateState(AppStartupState.NEED_LOGIN, { config });
            return;
          }
        }
      }

      // 3. Si no hay biometría o está deshabilitada, ir al login manual
      updateState(AppStartupState.NEED_LOGIN, { config });
      
    } catch (error) {
      console.error('Error during startup flow:', error);
      updateState(AppStartupState.ERROR, {
        error: 'Error durante el inicio de la aplicación'
      });
    }
  }, [checkAppConfiguration, checkBiometricAuthentication, skipBiometrics, updateState]);

  const retryStartup = useCallback(() => {
    performStartupFlow();
  }, [performStartupFlow]);

  const resetToQRConfig = useCallback(async () => {
    try {
      await keychainService.clearAppConfig();
      updateState(AppStartupState.NEED_QR_CONFIG);
    } catch (error) {
      console.error('Error resetting to QR config:', error);
      updateState(AppStartupState.ERROR, {
        error: 'Error al resetear la configuración'
      });
    }
  }, [updateState]);

  const skipBiometricAuth = useCallback(() => {
    if (result.config) {
      updateState(AppStartupState.NEED_LOGIN, { config: result.config });
    }
  }, [result.config, updateState]);

  const setAuthenticated = useCallback(() => {
    if (result.config) {
      updateState(AppStartupState.AUTHENTICATED, { config: result.config });
    }
  }, [result.config, updateState]);

  // Ejecutar el flujo al montar el hook
  useEffect(() => {
    performStartupFlow();
  }, [performStartupFlow]);

  return {
    ...result,
    retryStartup,
    resetToQRConfig,
    skipBiometricAuth,
    setAuthenticated,
    isLoading: result.state === AppStartupState.LOADING,
    needsQRConfig: result.state === AppStartupState.NEED_QR_CONFIG,
    needsBiometricAuth: result.state === AppStartupState.NEED_BIOMETRIC_AUTH,
    needsLogin: result.state === AppStartupState.NEED_LOGIN,
    isAuthenticated: result.state === AppStartupState.AUTHENTICATED,
    hasError: result.state === AppStartupState.ERROR,
  };
};
