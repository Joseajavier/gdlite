import { AppConfigData } from '../services/keychainService';

/**
 * Campos mínimos requeridos en el QR
 */
const REQUIRED_QR_FIELDS = [
  'TokenAplicacion',
  'IdUsuario',
  'UrlSwagger',
] as const;

/**
 * Interfaz para los datos que pueden venir en el QR
 */
export interface QRConfigData {
  TokenAplicacion: string;
  IdUsuario: string;
  NombreCompleto?: string;
  ImgUsuario?: string;
  UrlSwagger: string;
  ColorPrimario?: string;
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
  if (data.UrlSwagger && !isValidURL(data.UrlSwagger)) {
    errors.push('UrlSwagger debe ser una URL válida (http:// o https://)');
  }

  if (data.IdUsuario && data.IdUsuario.length < 1) {
    errors.push('IdUsuario debe tener al menos 1 caracter');
  }

  if (data.TokenAplicacion && data.TokenAplicacion.length < 10) {
    errors.push('TokenAplicacion debe tener al menos 10 caracteres');
  }

  // 5. Validaciones para campos opcionales
  if (data.ColorPrimario && typeof data.ColorPrimario !== 'string') {
    errors.push('ColorPrimario debe ser una cadena de texto');
  }
  if (data.NombreCompleto && typeof data.NombreCompleto !== 'string') {
    errors.push('NombreCompleto debe ser una cadena de texto');
  }
  if (data.ImgUsuario && typeof data.ImgUsuario !== 'string') {
    errors.push('ImgUsuario debe ser una cadena de texto');
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
    TokenAplicacion: data.TokenAplicacion,
    IdUsuario: data.IdUsuario,
    UrlSwagger: data.UrlSwagger,
  };
  if (data.NombreCompleto) validData.NombreCompleto = data.NombreCompleto;
  if (data.ImgUsuario) validData.ImgUsuario = data.ImgUsuario;
  if (data.ColorPrimario) validData.ColorPrimario = data.ColorPrimario;

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
    apiBaseUrl: qrData.UrlSwagger,
    userId: qrData.IdUsuario,
    token: qrData.TokenAplicacion,
    refreshToken: '',
    organizationId: '',
    clientId: '',
    clientSecret: '',
    environment: 'production',
    lastLoginDate: new Date().toISOString(),
    // Puedes agregar otros campos personalizados si AppConfigData lo permite
  };
}

/**
 * Genera un QR de ejemplo para testing
 */
export function generateExampleQRData(): string {
  const exampleData: QRConfigData = {
    TokenAplicacion: '002D7ED9FB845C41B2E4A28F6A041460',
    IdUsuario: '36',
    NombreCompleto: 'Juan Pérez',
    ImgUsuario: '1.png',
    UrlSwagger: 'https://gestdocj.add4u.com/GestDocX/GestDocX/swagger-ui/index.html',
    ColorPrimario: 'success',
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
  fields.push(`Token: ${qrData.TokenAplicacion}`);
  fields.push(`Usuario: ${qrData.IdUsuario}`);
  if (qrData.NombreCompleto) fields.push(`Nombre: ${qrData.NombreCompleto}`);
  if (qrData.ImgUsuario) fields.push(`Imagen: ${qrData.ImgUsuario}`);
  fields.push(`URL Swagger: ${qrData.UrlSwagger}`);
  if (qrData.ColorPrimario) fields.push(`Color: ${qrData.ColorPrimario}`);
  return fields.join('\n');
}
