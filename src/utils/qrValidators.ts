import { AppConfigData } from '../services/keychainService';

/**
 * Campos mínimos requeridos en el QR
 */
const REQUIRED_QR_FIELDS = [
  'apiBaseUrl',
  'userId',
  'token',
] as const;

/**
 * Interfaz para los datos que pueden venir en el QR
 */
export interface QRConfigData {
  apiBaseUrl: string;
  userId: string;
  token: string;
  refreshToken?: string;
  organizationId?: string;
  clientId?: string;
  clientSecret?: string;
  environment?: 'production' | 'staging' | 'development';
  expiresAt?: string; // ISO string
}

/**
 * Resultado de la validación del QR
 */
export interface QRValidationResult {
  isValid: boolean;
  data?: QRConfigData;
  errors: string[];
}

/**
 * Valida que un string sea un JSON válido
 */
export function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida que una URL tenga formato correcto
 */
export function isValidURL(url: string): boolean {
  try {
    const urlObject = new URL(url);
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida que una fecha ISO sea válida y futura
 */
export function isValidFutureDate(isoString: string): boolean {
  try {
    const date = new Date(isoString);
    const now = new Date();
    return !isNaN(date.getTime()) && date > now;
  } catch {
    return false;
  }
}

/**
 * Valida los datos del QR según los campos requeridos
 */
export function validateQRData(jsonString: string): QRValidationResult {
  const errors: string[] = [];
  
  // 1. Verificar que sea JSON válido
  if (!isValidJSON(jsonString)) {
    return {
      isValid: false,
      errors: ['El código QR no contiene un JSON válido'],
    };
  }

  let data: any;
  try {
    data = JSON.parse(jsonString);
  } catch {
    return {
      isValid: false,
      errors: ['Error al parsear el JSON del código QR'],
    };
  }

  // 2. Verificar que sea un objeto
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {
      isValid: false,
      errors: ['El código QR debe contener un objeto JSON'],
    };
  }

  // 3. Verificar campos requeridos
  for (const field of REQUIRED_QR_FIELDS) {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
      errors.push(`Campo requerido faltante o inválido: ${field}`);
    }
  }

  // 4. Validaciones específicas para campos requeridos
  if (data.apiBaseUrl && !isValidURL(data.apiBaseUrl)) {
    errors.push('apiBaseUrl debe ser una URL válida (http:// o https://)');
  }

  if (data.userId && data.userId.length < 3) {
    errors.push('userId debe tener al menos 3 caracteres');
  }

  if (data.token && data.token.length < 10) {
    errors.push('token debe tener al menos 10 caracteres');
  }

  // 5. Validaciones para campos opcionales
  if (data.environment && !['production', 'staging', 'development'].includes(data.environment)) {
    errors.push('environment debe ser: production, staging o development');
  }

  if (data.expiresAt && !isValidFutureDate(data.expiresAt)) {
    errors.push('expiresAt debe ser una fecha ISO válida y futura');
  }

  if (data.refreshToken && typeof data.refreshToken !== 'string') {
    errors.push('refreshToken debe ser una cadena de texto');
  }

  if (data.organizationId && typeof data.organizationId !== 'string') {
    errors.push('organizationId debe ser una cadena de texto');
  }

  if (data.clientId && typeof data.clientId !== 'string') {
    errors.push('clientId debe ser una cadena de texto');
  }

  if (data.clientSecret && typeof data.clientSecret !== 'string') {
    errors.push('clientSecret debe ser una cadena de texto');
  }

  // 6. Si hay errores, retornar resultado inválido
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  // 7. Construir datos válidos
  const validData: QRConfigData = {
    apiBaseUrl: data.apiBaseUrl,
    userId: data.userId,
    token: data.token,
  };

  // Agregar campos opcionales si están presentes
  if (data.refreshToken) validData.refreshToken = data.refreshToken;
  if (data.organizationId) validData.organizationId = data.organizationId;
  if (data.clientId) validData.clientId = data.clientId;
  if (data.clientSecret) validData.clientSecret = data.clientSecret;
  if (data.environment) validData.environment = data.environment;
  if (data.expiresAt) validData.expiresAt = data.expiresAt;

  return {
    isValid: true,
    data: validData,
    errors: [],
  };
}

/**
 * Convierte datos del QR a formato AppConfigData
 */
export function qrDataToAppConfig(qrData: QRConfigData): AppConfigData {
  return {
    apiBaseUrl: qrData.apiBaseUrl,
    userId: qrData.userId,
    token: qrData.token,
    refreshToken: qrData.refreshToken || '',
    organizationId: qrData.organizationId || '',
    clientId: qrData.clientId || '',
    clientSecret: qrData.clientSecret || '',
    environment: qrData.environment || 'production',
    lastLoginDate: new Date().toISOString(),
  };
}

/**
 * Genera un QR de ejemplo para testing
 */
export function generateExampleQRData(): string {
  const exampleData: QRConfigData = {
    apiBaseUrl: 'https://api.gdlite.com',
    userId: 'user123',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example',
    refreshToken: 'refresh_token_example',
    organizationId: 'org_gdlite_001',
    clientId: 'client_gdlite_app',
    clientSecret: 'client_secret_secure',
    environment: 'production',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
  };

  return JSON.stringify(exampleData, null, 2);
}

/**
 * Verifica si los datos del QR contienen todos los campos esperados
 */
export function hasMinimumRequiredFields(data: any): boolean {
  return REQUIRED_QR_FIELDS.every(field => 
    data[field] && typeof data[field] === 'string' && data[field].trim() !== ''
  );
}

/**
 * Obtiene un resumen de los campos presentes en el QR
 */
export function getQRDataSummary(qrData: QRConfigData): string {
  const fields = [];
  
  fields.push(`URL: ${qrData.apiBaseUrl}`);
  fields.push(`Usuario: ${qrData.userId}`);
  fields.push(`Token: ${qrData.token.substring(0, 20)}...`);
  
  if (qrData.organizationId) fields.push(`Organización: ${qrData.organizationId}`);
  if (qrData.environment) fields.push(`Entorno: ${qrData.environment}`);
  if (qrData.expiresAt) {
    const expiryDate = new Date(qrData.expiresAt);
    fields.push(`Expira: ${expiryDate.toLocaleDateString()}`);
  }
  
  return fields.join('\n');
}
