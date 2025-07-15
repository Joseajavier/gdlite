import LocalAuth from 'react-native-local-auth';

export enum BiometricType {
  TouchID = 'TouchID',
  FaceID = 'FaceID',
  Fingerprint = 'Fingerprint',
  None = 'None',
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: BiometricType;
}

export interface BiometricCapabilities {
  isAvailable: boolean;
  biometricType: BiometricType;
  isEnrolled: boolean;
}

class AuthService {
  /**
   * Verifica las capacidades biométricas del dispositivo
   */
  async getBiometricCapabilities(): Promise<BiometricCapabilities> {
    try {
      // isSupported() resuelve con el tipo: 'TouchID', 'FaceID', 'Fingerprint', o lanza error si no está disponible
      const biometricTypeStr = await LocalAuth.isSupported();

      let biometricType: BiometricType = BiometricType.None;
      let isEnrolled = true; // isSupported solo resuelve si hay biometría configurada
      switch (biometricTypeStr) {
        case 'TouchID':
          biometricType = BiometricType.TouchID;
          break;
        case 'FaceID':
          biometricType = BiometricType.FaceID;
          break;
        case 'Fingerprint':
          biometricType = BiometricType.Fingerprint;
          break;
        default:
          biometricType = BiometricType.Fingerprint;
      }

      return {
        isAvailable: true,
        biometricType,
        isEnrolled,
      };
    } catch (error) {
      // Si lanza error, NO hay biometría disponible o NO está configurada
      return {
        isAvailable: false,
        biometricType: BiometricType.None,
        isEnrolled: false,
      };
    }
  }

  /**
   * Determina el tipo de biometría disponible en el dispositivo
   */
  private async getBiometricType(): Promise<BiometricType> {
    try {
      const biometricTypeStr = await LocalAuth.isSupported();
      switch (biometricTypeStr) {
        case 'TouchID':
          return BiometricType.TouchID;
        case 'FaceID':
          return BiometricType.FaceID;
        case 'Fingerprint':
          return BiometricType.Fingerprint;
        default:
          return BiometricType.Fingerprint; // Por defecto para Android
      }
    } catch {
      return BiometricType.None;
    }
  }

  /**
   * Ejecuta la autenticación biométrica
   */
  async authenticateWithBiometrics(reason?: string): Promise<BiometricAuthResult> {
    try {
      const capabilities = await this.getBiometricCapabilities();

      if (!capabilities.isAvailable) {
        return {
          success: false,
          error: 'Autenticación biométrica no disponible en este dispositivo',
        };
      }

      // isEnrolled SIEMPRE true si isAvailable = true con esta librería
      const defaultReason = this.getDefaultAuthReason(capabilities.biometricType);
      const authReason = reason || defaultReason;

      const result = await LocalAuth.authenticate({
        reason: authReason,
        fallbackToPasscode: true,
      });

      // El método lanza excepción si fallas, si no, simplemente resuelve (no da un objeto con .success)
      return {
        success: true,
        biometricType: capabilities.biometricType,
      };
    } catch (error: any) {
      return {
        success: false,
        error: (error && error.message) || 'Autenticación biométrica fallida',
      };
    }
  }

  /**
   * Obtiene el mensaje por defecto según el tipo de biometría
   */
  private getDefaultAuthReason(biometricType: BiometricType): string {
    switch (biometricType) {
      case BiometricType.TouchID:
        return 'Coloca tu dedo en el sensor para acceder a la aplicación';
      case BiometricType.FaceID:
        return 'Posiciona tu rostro para acceder a la aplicación';
      case BiometricType.Fingerprint:
        return 'Usa tu huella dactilar para acceder a la aplicación';
      default:
        return 'Usa tu biometría para acceder a la aplicación';
    }
  }

  /**
   * Verifica si el dispositivo soporta biometría y tiene datos registrados
   */
  async canUseBiometrics(): Promise<boolean> {
    const capabilities = await this.getBiometricCapabilities();
    return capabilities.isAvailable && capabilities.isEnrolled;
  }

  /**
   * Obtiene una descripción amigable del tipo de biometría
   */
  getBiometricTypeDescription(biometricType: BiometricType): string {
    switch (biometricType) {
      case BiometricType.TouchID:
        return 'Touch ID';
      case BiometricType.FaceID:
        return 'Face ID';
      case BiometricType.Fingerprint:
        return 'Huella dactilar';
      default:
        return 'Autenticación biométrica';
    }
  }

  /**
   * Simula autenticación para testing (solo en desarrollo)
   */
  async authenticateForTesting(): Promise<BiometricAuthResult> {
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        biometricType: BiometricType.TouchID,
      };
    }

    return this.authenticateWithBiometrics();
  }
}

export const authService = new AuthService();
export default authService;
