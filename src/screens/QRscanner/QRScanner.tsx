import React, { useState, useEffect, useCallback } from 'react';
import { Animated, Easing, Platform, SafeAreaView, View, Alert, StyleSheet, Text } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { theme } from '../../styles/theme';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { keychainService, AppConfigData } from '../../services/keychainService';
import { validateQRData, qrDataToAppConfig, getQRDataSummary } from '../../utils/qrValidators';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

interface QRScannerProps {
  onScanSuccess?: (data: AppConfigData) => void;
  onScanCancel?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanCancel }) => {
  const [checkingConfig, setCheckingConfig] = useState(true);
  const [hasConfig, setHasConfig] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  // Comprobar si ya hay configuración guardada
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const config = await keychainService.getAppConfig();
        if (config) {
          if (onScanSuccess) onScanSuccess(config);
          setHasConfig(true);
        }
      } catch (error) {
        console.error('[QRScanner] Error comprobando config guardada:', error);
      }
      setCheckingConfig(false);
    };
    checkConfig();
  }, [onScanSuccess]);

  // Animación línea de escaneo
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

  // Guardar los datos escaneados y lanzar el flujo normal
  const saveScannedData = async (qrData: any) => {
    try {
      console.log('[QRScanner] Datos QR recibidos:', qrData);
      const appConfig = qrDataToAppConfig(qrData);
      console.log('[QRScanner] appConfig transformado:', appConfig);
      // Guardar en Keychain y en AsyncStorage para que el modal lo lea
      const savedKeychain = await keychainService.saveAppConfig(appConfig);
      const savedStorage = await import('../../utils/storage').then(m => m.StorageManager.saveAppConfig(appConfig));
      // Leer de AsyncStorage para verificar que se guardó correctamente
      const loadedConfig = await import('../../utils/storage').then(m => m.StorageManager.getAppConfig());
      console.log('[QRScanner] appConfig guardado en AsyncStorage:', loadedConfig);
      if (!savedKeychain) {
        Alert.alert('Error', 'No se pudo guardar la configuración');
        return;
      }
      completeConfiguration(appConfig);
    } catch (error) {
      console.error('[QRScanner] Error saving scanned data:', error);
      Alert.alert('Error', 'No se pudo guardar la configuración');
    }
  };

  // Finaliza la configuración y llama al callback de éxito
  const completeConfiguration = (appConfig: AppConfigData) => {
    if (onScanSuccess) onScanSuccess(appConfig);
  };

  // Obtener la cámara trasera
  const devices = useCameraDevice('back');
  const device = devices;  // Usamos el dispositivo 'back' directamente

  // Pedir permiso de cámara
  const requestCameraPermission = useCallback(async () => {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
      let status = await check(permission);
      if (status === RESULTS.GRANTED) {
        setHasPermission(true);
        return;
      }
      if (status === RESULTS.BLOCKED) {
        setHasPermission(false);
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
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        Alert.alert(
          'Permiso de Cámara',
          'No has concedido permiso de cámara. Para usar el escáner QR, habilítalo en los ajustes del dispositivo.',
          [
            { text: 'Abrir Ajustes', onPress: () => openSettings() },
            { text: 'Cancelar', style: 'cancel', onPress: onScanCancel }
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
    requestCameraPermission();
  }, [requestCameraPermission]);

  // -------- INTEGRACIÓN SOLO PARA iOS --------
  // Escaneo automático de QR solo en iOS
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      console.log('QR Escaneado: ', codes);  // Verifica si se está escaneando
      if (Platform.OS !== 'ios') return;  // Solo procesamos en iOS
      if (codes.length > 0 && !scanned) {
        console.log('Código QR detectado:', codes[0].value);  // Verifica el valor del QR
        setScanned(true);
        handleQRCodeScanned({ data: codes[0].value });
      }
    }
  });
  // --------------------------------------------

  // Lógica para manejar el escaneo del QR
  const handleQRCodeScanned = async (scanResult: any) => {
    const data = scanResult?.data;
    console.log('Datos escaneados:', data);  // Verifica qué datos se han obtenido
    try {
      const validationResult = validateQRData(data);
      if (!validationResult.isValid) {
        console.log('QR no válido:', validationResult.errors);  // Log de errores si el QR no es válido
        setTimeout(() => setScanned(false), 500);
        Alert.alert(
          'QR Inválido',
          `El código QR no es válido:\n\n${validationResult.errors.join('\n')}`,
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
        return;
      }
      const qrData = validationResult.data!;
      // Guarda directamente sin mostrar resumen
      saveScannedData(qrData);
    } catch (error) {
      console.error('[QRScanner] Error parsing QR data:', error);
      setTimeout(() => setScanned(false), 500);
      Alert.alert('Error', 'No se pudo procesar el código QR. Asegúrate de que contiene datos válidos.', [{ text: 'OK', onPress: () => setScanned(false) }]);
    }
  };

  // Renderizar según permisos y estados
  if (hasConfig) return null;
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

  // Render principal de cámara y overlay
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.cameraBackground}
          device={device}
          isActive={true}
          codeScanner={codeScanner} // Solo iOS: escaneo automático
        />
        <View style={styles.overlayCenter}>
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
          <View style={styles.focusFrameContainer}>
            <View style={styles.focusFrame}>
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanLineAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [8, 220 - 8],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
          {/* Botón test para lanzar flujo de guardado manualmente */}
          <View style={styles.testIconContainer}>
            <Button
              variant="contained"
              color="secondary"
              onPress={() => handleQRCodeScanned({
                data: JSON.stringify({
                  TokenAplicacion: '002D7ED9FB845C41B2E4A28F6A041460',
                  IdUsuario: '36',
                  NombreCompleto: 'Juan Pérez',
                  ImgUsuario: '1.png',
                  UrlSwagger: 'https://gestdocj.add4u.com/GestDocX/GestDocX/swagger-ui/index.html',
                  ColorPrimario: 'success',
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
