// authService.ts



import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    username: string;
    email?: string;
    ImgUsuario?: string;
    [key: string]: any;
  };
}

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    // Simulación de login, reemplaza con tu lógica real
    if (username === 'admin' && password === 'admin') {
      const user = { id: '1', username: 'admin', email: 'admin@demo.com' };
      const token = 'demo-token';
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      return { token, user };
    } else {
      throw new Error('Credenciales incorrectas');
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
  },

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    const userStr = await AsyncStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },

  async canUseBiometrics(): Promise<boolean> {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      return !!biometryType;
    } catch (e) {
      return false;
    }
  },

  async authenticateWithBiometrics(): Promise<boolean> {
    try {
      const result = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: 'Autenticación biométrica',
          subtitle: 'Inicia sesión con Face ID/Touch ID',
          description: 'Usa tu biometría para acceder',
          cancel: 'Cancelar',
        },
      });
      return !!(result && result.username && result.password);
    } catch (e) {
      return false;
    }
  },
};
