import React, { useState, useEffect, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  Text,
} from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../styles/theme';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { keychainService, AppConfigData } from '../services/keychainService';
import { authService } from '../services/authService';
import { validateQRData, qrDataToAppConfig, getQRDataSummary } from '../utils/qrValidators';
import { Camera, useCameraDevices } from 'react-native-vision-camera'; // Usar la cámara de vision

interface QRScannerProps {
  onScanSuccess?: (data: AppConfigData) => void;
  onScanCancel?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanCancel }) => {
  const [checkingConfig, setCheckingConfig] = useState(true);
  const [configChecked, setConfigChecked] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);
  
  // Al montar, si ya hay datos guardados, ir a login directamente
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const config = await keychainService.getAppConfig();
        if (config) {
          console.log('[QRScanner] Configuración ya guardada, comprobando biometría...');
          const biometricsEnabled = await keychainService.getBiometricsEnabled();
          const canUseBiometrics = await authService.canUseBiometrics();
          if (biometricsEnabled && canUseBiometrics) {
            // Solicitar autenticación biométrica
            const authResult = await authService.authenticateWithBiometrics();
            if (authResult) {
              if (onScanSuccess) onScanSuccess(config);
            } else {
              Alert.alert('Error', 'Autenticación biométrica fallida.');
            }
          } else if (!biometricsEnabled && canUseBiometrics) {
            Alert.alert(
              'Activar FaceID/biometría',
              '¿Deseas activar la autenticación biométrica para futuros accesos?',
              [
                { text: 'No', style: 'cancel', onPress: () => onScanSuccess && onScanSuccess(config) },
                {
                  text: 'Sí',
                  onPress: async () => {
                    await keychainService.setBiometricsEnabled(true);
                    onScanSuccess && onScanSuccess(config);
                  }
                }
              ]
            );
          } else {
            if (onScanSuccess) onScanSuccess(config);
          }
          setHasConfig(true);
        }
      } catch (error) {
        console.error('[QRScanner] Error comprobando config guardada:', error);
      }
      setConfigChecked(true);
      setCheckingConfig(false);
    };
    checkConfig();
  }, [onScanSuccess]);
  // Guarda los datos escaneados y muestra alertas de biometría si corresponde
  const saveScannedData = async (qrData: any) => {
    console.log('[QRScanner] saveScannedData llamado con:', qrData);
    try {
      const appConfig = qrDataToAppConfig(qrData);
      console.log('[QRScanner] appConfig generado:', appConfig);
      const saved = await keychainService.saveAppConfig(appConfig);
      console.log('[QRScanner] Resultado de saveAppConfig:', saved);
      if (!saved) {
        Alert.alert('Error', 'No se pudo guardar la configuración');
        return;
      }
      const canUseBiometrics = await authService.canUseBiometrics();
      console.log('[QRScanner] ¿Puede usar biometría?:', canUseBiometrics);
      if (canUseBiometrics) {
        Alert.alert(
          'Activar Biometría',
          '¿Deseas activar la autenticación biométrica para futuros accesos?',
          [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => completeConfiguration(appConfig)
            },
            {
              text: 'Sí',
              onPress: async () => {
                try {
                  await keychainService.setBiometricsEnabled(true);
                  console.log('[QRScanner] Biometría activada');
                } catch (error) {
                  console.error('[QRScanner] Error enabling biometrics:', error);
                }
                completeConfiguration(appConfig);
              }
            }
          ]
        );
      } else {
        completeConfiguration(appConfig);
      }
    } catch (error) {
      console.error('[QRScanner] Error saving scanned data:', error);
      Alert.alert('Error', 'No se pudo guardar la configuración');
    }
  };
  // Animación de la línea vertical dentro del marco QR
  const scanLineAnim = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let isMounted = true;
    const animateLine = () => {
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isMounted) animateLine();
      });
    };
    animateLine();
    return () => { isMounted = false; };
  }, [scanLineAnim]);
  // Finaliza la configuración y muestra alerta de éxito
  const completeConfiguration = (appConfig: AppConfigData) => {
    console.log('[QRScanner] completeConfiguration llamado');
    Alert.alert(
      'Configuración Guardada',
      'Los datos se han guardado correctamente. Serás redirigido a la pantalla principal.',
      [
        {
          text: 'Continuar',
          onPress: () => {
            console.log('[QRScanner] onScanSuccess callback');
            if (onScanSuccess) onScanSuccess(appConfig);
          }
        }
      ]
    );
  };
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // Eliminado: const [scannedData, setScannedData] = useState<string | null>(null);

  // Obtener los dispositivos disponibles
  const devices = useCameraDevices();
  // Selecciona manualmente el primer dispositivo con position 'back'
  const device = React.useMemo(() => {
    if (Array.isArray(devices)) {
      return devices.find((d) => d.position === 'back');
    }
    // Vision Camera <3.x puede devolver un objeto
    if (devices && typeof devices === 'object' && (devices as any).back) {
      return (devices as any).back;
    }
    return undefined;
  }, [devices]);

  // Trazas de dispositivos
  React.useEffect(() => {
    console.log('[QRScanner] useCameraDevices() ->', devices);
    if (device) {
      console.log('[QRScanner] device (cámara trasera) detectado:', device);
    } else {
      console.warn('[QRScanner] No se detectó cámara trasera. devices:', devices);
    }
  }, [devices, device]);


  // Mejor flujo de permisos: check -> request si es necesario, logs para depuración
  const requestCameraPermission = useCallback(async () => {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

      console.log('[QRScanner] Comprobando permiso para', permission);
      let status = await check(permission);
      console.log('[QRScanner] Estado actual del permiso de cámara:', status);

      if (status === RESULTS.GRANTED) {
        setHasPermission(true);
        console.log('[QRScanner] Permiso concedido (GRANTED)');
        return;
      }

      if (status === RESULTS.BLOCKED) {
        setHasPermission(false);
        console.warn('[QRScanner] Permiso BLOQUEADO');
        Alert.alert(
          'Permiso de Cámara',
          'El acceso a la cámara está bloqueado. Debes habilitarlo manualmente en los ajustes del dispositivo.',
          [
            { text: 'Abrir Ajustes', onPress: () => openSettings() },
            { text: 'Cancelar', style: 'cancel', onPress: onScanCancel }
          ]
        );
        return;
      }

      // Si está denegado o limitado, intentamos solicitarlo
      console.log('[QRScanner] Solicitando permiso de cámara...');
      const result = await request(permission);
      console.log('[QRScanner] Resultado de solicitar permiso de cámara:', result);
      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
        console.log('[QRScanner] Permiso concedido tras solicitar');
      } else if (result === RESULTS.DENIED) {
        setHasPermission(false);
        console.warn('[QRScanner] Permiso DENEGADO tras solicitar');
        Alert.alert(
          'Permiso de Cámara',
          'No has concedido permiso de cámara. Para usar el escáner QR, habilítalo en los ajustes del dispositivo.',
          [
            { text: 'Abrir Ajustes', onPress: () => openSettings() },
            { text: 'Cancelar', style: 'cancel', onPress: onScanCancel }
          ]
        );
      } else if (result === RESULTS.BLOCKED) {
        setHasPermission(false);
        console.warn('[QRScanner] Permiso BLOQUEADO tras solicitar');
        Alert.alert(
          'Permiso de Cámara',
          'El acceso a la cámara está bloqueado. Debes habilitarlo manualmente en los ajustes del dispositivo.',
          [
            { text: 'Abrir Ajustes', onPress: () => openSettings() },
            { text: 'Cancelar', style: 'cancel', onPress: onScanCancel }
          ]
        );
      } else {
        setHasPermission(false);
        console.error('[QRScanner] Estado inesperado del permiso:', result);
        Alert.alert(
          'Permiso de Cámara',
          `Estado inesperado del permiso: ${result}`,
          [
            { text: 'OK', onPress: onScanCancel }
          ]
        );
      }
    } catch (error) {
      console.error('[QRScanner] Error comprobando/solicitando permiso de cámara:', error);
      setHasPermission(false);
      Alert.alert('Error', 'No se pudo comprobar el permiso de cámara.');
    }
  }, [onScanCancel]);

  useEffect(() => {
    console.log('[QRScanner] useEffect: requestCameraPermission');
    requestCameraPermission();
  }, [requestCameraPermission]);

  // Lógica para manejar el escaneo
  const handleQRCodeScanned = async (scanResult: any) => {
    console.log('[QRScanner] handleQRCodeScanned llamado con:', scanResult);
    const data = scanResult?.data;
    try {
      const validationResult = validateQRData(data);
      console.log('[QRScanner] Resultado de validateQRData:', validationResult);
      if (!validationResult.isValid) {
        Alert.alert(
          'QR Inválido',
          `El código QR no es válido:\n\n${validationResult.errors.join('\n')}`,
          [{ text: 'OK' }]
        );
        return;
      }
      const qrData = validationResult.data!;
      const configSummary = getQRDataSummary(qrData);
      console.log('[QRScanner] QR válido. Resumen:', configSummary);
      Alert.alert(
        'QR Escaneado',
        `Se encontraron los siguientes datos:\n\n${configSummary}\n\n¿Deseas guardar esta configuración?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Guardar', onPress: () => saveScannedData(qrData) }
        ]
      );
    } catch (error) {
      console.error('[QRScanner] Error parsing QR data:', error);
      Alert.alert(
        'Error',
        'No se pudo procesar el código QR. Asegúrate de que contiene datos válidos.',
        [{ text: 'OK' }]
      );
    }
  };


  // Renderizar si aún no se ha concedido el permiso
  // Si estamos comprobando config, mostrar solo loader
  // Si ya hay datos guardados, no mostrar nada (redirige automáticamente)
  if (hasConfig) {
    return null;
  }
  // Si estamos comprobando config y no hay datos, mostrar loader
  if (checkingConfig) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.cameraContainer}>
          <Typography variant="body1" style={styles.overlayText}>Comprobando configuración...</Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasPermission || !device) {
    console.warn('[QRScanner] Render: sin permiso o sin cámara. hasPermission:', hasPermission, 'device:', device);
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.cameraContainer}>
          <View style={styles.overlayCenter}>
            <Card style={styles.scannerCard}>
              <Typography variant="h3" style={styles.errorTitle}>
                Permiso denegado
              </Typography>
              <Typography variant="body1" style={styles.errorDescription}>
                No has concedido permiso de cámara o no se detecta la cámara del dispositivo. Para usar el escáner QR, habilítalo en los ajustes del dispositivo y asegúrate de que la cámara funciona correctamente.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onPress={() => openSettings()}
                style={styles.errorButton}
              >
                Abrir Ajustes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onPress={onScanCancel}
                style={styles.errorButtonSecondary}
              >
                Cancelar
              </Button>
            </Card>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  console.log('[QRScanner] Render: cámara lista, mostrando preview. hasPermission:', hasPermission, 'device:', device);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.cameraBackground}
          device={device}
          isActive={true}
          onInitialized={() => console.log('[QRScanner] Camera onInitialized')}
          onError={e => console.error('[QRScanner] Camera onError', e)}
        />
        <View style={styles.overlayCenter}>
          {/* Card arriba */}
          <View style={styles.topCardContainer}>
            <Card style={styles.scannerCard}>
              <Typography variant="h3" style={styles.title}>
                Escanear Código QR
              </Typography>
              <Typography variant="body1" style={styles.description}>
                Apunta la cámara hacia el código QR que contiene los datos de configuración.
              </Typography>
            </Card>
          </View>
          {/* Marco de enfoque QR en el centro */}
          <View style={styles.focusFrameContainer}>
            <View style={styles.focusFrame}>
              {/* Línea animada vertical */}
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanLineAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [8, 220 - 8], // padding superior/inferior
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
          {/* Icono flotante de test en la esquina inferior derecha */}
          <View style={styles.testIconContainer}>
            <Button
              variant="contained"
              color="secondary"
              onPress={() => handleQRCodeScanned({
                data: JSON.stringify({
                  apiBaseUrl: 'https://api.gdlite.com',
                  userId: 'admin',
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demoToken123456',
                  refreshToken: 'refresh_token_demo',
                  organizationId: 'org_demo_001',
                  clientId: 'client_demo_app',
                  clientSecret: 'client_secret_demo',
                  environment: 'staging',
                  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
                })
              })}
              style={styles.testIconButton}
            >
              <Text style={styles.testIconEmoji}>🧪</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scanLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary.main,
    opacity: 0.85,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  testIconEmoji: {
    fontSize: 28,
    textAlign: 'center',
  },
  testIconContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    zIndex: 10,
    elevation: 10,
  },
  testIconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary.main,
    shadowColor: theme.colors.secondary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  errorTitle: {
    textAlign: 'center',
    color: theme.colors.error.main,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 22,
  },
  errorDescription: {
    marginVertical: 16,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  errorButton: {
    minWidth: 200,
    marginTop: 0,
    marginBottom: 8,
  },
  errorButtonSecondary: {
    minWidth: 200,
    marginTop: 8,
  },
  topCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 24,
    zIndex: 2,
  },
  focusFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  focusFrame: {
    width: 220,
    height: 220,
    borderWidth: 4,
    borderColor: theme.colors.primary.main,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  overlayCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  overlayText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    borderRadius: 8,
  },
  scannerCard: {
    padding: 24,
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    elevation: 3,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  // camera style for preview removed, now full background
  testButton: {
    minWidth: 200,
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.colors.background.paper,
    borderRadius: 8,
    width: '100%',
  },
  resultText: {
    color: theme.colors.text.secondary,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

export default QRScanner;
