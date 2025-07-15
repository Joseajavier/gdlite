declare module 'react-native-local-auth' {
  export interface AuthResult {
    success: boolean;
    error?: string;
  }

  export interface AuthOptions {
    reason: string;
    fallbackTitle?: string;
    suppressEnterPassword?: boolean;
  }

  export default class LocalAuth {
    static isAvailable(): Promise<boolean>;
    static hasEnrolledFingerprints(): Promise<boolean>;
    static getBiometryType(): Promise<string>;
    static authenticate(options: AuthOptions): Promise<AuthResult>;
  }
}
