// authService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfigData, StorageManager } from '../utils/storage';

const API_BASE_URL = 'https://tu-api.com'; // Cambia por tu endpoint real

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

export class AuthService {
  static async login(username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Credenciales incorrectas');
    const data = await res.json();
    // Guarda el token y usuario en AsyncStorage
    await AsyncStorage.setItem('auth_token', data.token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
    return data;
  }

  static async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
    // Si tu API requiere endpoint de logout, puedes llamarlo aquí
  }

  static async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    const userStr = await AsyncStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export default AuthService;
