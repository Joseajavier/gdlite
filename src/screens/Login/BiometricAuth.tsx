import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { theme } from '../../styles/theme';

interface BiometricAuthProps {
  onBiometricSuccess?: () => void;
  onFallbackToLogin?: () => void;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ 
  onBiometricSuccess, 
  onFallbackToLogin 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  // Función para obtener la imagen diaria (como en GdAdmin)
  const getDailyBackgroundImage = (): string => {
    const date = new Date();
    let dia: string | number = date.getDate();
    
    if (dia < 10) {
      dia = '0' + dia;
    }
    
    return `https://sede.add4u.com/public/GestDoc/loginImages/img${dia}.jpg`;
  };

  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        // Intentar importar la librería dinámicamente
        const ReactNativeBiometrics = require('react-native-biometrics').default;
        const rnBiometrics = new ReactNativeBiometrics();
        
        const { available, biometryType } = await rnBiometrics.isSensorAvailable();
        console.log('Biometric sensor available:', available, 'Type:', biometryType);
        if (available) {
          let tipo = 'Desconocido';
          if (biometryType === ReactNativeBiometrics.Biometrics) tipo = 'Biometría';
          if (biometryType === ReactNativeBiometrics.FaceID) tipo = 'Face ID';
          if (biometryType === ReactNativeBiometrics.TouchID) tipo = 'Touch ID';
          if (biometryType === ReactNativeBiometrics.Biometrics) tipo = 'Biometría';
          Alert.alert('Sensor biométrico detectado', `Tipo: ${tipo}`);
          // Intentar autenticación automáticamente
          setTimeout(() => {
            handleBiometricAuthAction();
          }, 1000);
        } else {
          Alert.alert('No se detectó sensor biométrico', 'No se puede usar Face ID ni Touch ID.');
          // Si no hay biometría disponible, ir directamente al login
          if (onFallbackToLogin) {
            onFallbackToLogin();
          }
        }
      } catch (error) {
        console.log('Error checking biometric availability:', error);
        Alert.alert('Error al detectar biometría', String(error));
        if (onFallbackToLogin) {
          onFallbackToLogin();
        }
      }
    };

    const handleBiometricAuthAction = async () => {
      setIsLoading(true);
      
      try {
        const ReactNativeBiometrics = require('react-native-biometrics').default;
        const rnBiometrics = new ReactNativeBiometrics();
        
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Authenticate with biometric',
          cancelButtonText: 'Cancel',
        });
        
        if (success) {
          // Autenticación exitosa - ir al dashboard
          if (onBiometricSuccess) {
            onBiometricSuccess();
          }
        } else {
          // Autenticación fallida - ir al login
          if (onFallbackToLogin) {
            onFallbackToLogin();
          }
        }
      } catch (error) {
        console.log('Biometric authentication error:', error);
        if (onFallbackToLogin) {
          onFallbackToLogin();
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkBiometricAvailability();
  }, [onFallbackToLogin, onBiometricSuccess]); // Se ejecuta una vez al montar

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    
    try {
      const ReactNativeBiometrics = require('react-native-biometrics').default;
      const rnBiometrics = new ReactNativeBiometrics();
      
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Autenticarse para acceder a GdLite',
        cancelButtonText: 'Cancelar',
        fallbackPromptMessage: 'Usar contraseña'
      });

      if (success) {
        // Autenticación exitosa
        if (onBiometricSuccess) {
          onBiometricSuccess();
        }
      } else {
        // Autenticación fallida
        handleAuthFailure();
      }
    } catch (error) {
      console.log('Biometric auth error:', error);
      handleAuthFailure();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthFailure = () => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    if (newAttemptCount >= 2) {
      // Después de 2 intentos, mostrar opción de login tradicional
      setShowFallback(true);
      Alert.alert(
        'Autenticación biométrica fallida',
        'Has fallado 2 intentos. Puedes continuar con usuario y contraseña.',
        [
          { text: 'Reintentar', onPress: handleBiometricAuth },
          { text: 'Usar contraseña', onPress: onFallbackToLogin }
        ]
      );
    } else {
      // Primer intento fallido
      Alert.alert(
        'Autenticación fallida',
        'La autenticación biométrica falló. ¿Quieres intentar de nuevo?',
        [
          { text: 'Reintentar', onPress: handleBiometricAuth },
          { text: 'Usar contraseña', onPress: onFallbackToLogin }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.main} />
      
      {/* Fondo decorativo con imagen diaria */}
      <View style={styles.backgroundOverlay}>
        <Image
          source={{ uri: getDailyBackgroundImage() }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.backgroundMask} />
      </View>
      
      {/* Contenido principal */}
      <View style={styles.content}>
        <Card style={styles.authCard}>
          {/* Logo y título */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Typography variant="h1" style={styles.logoText}>
                GdLite
              </Typography>
            </View>
            
            <Typography variant="h4" style={styles.title}>
              Autenticación biométrica
            </Typography>
            
            <Typography variant="body1" style={styles.subtitle}>
              Utiliza tu huella o Face ID para acceder de forma segura
            </Typography>
          </View>

          {/* Sección de autenticación */}
          <View style={styles.authSection}>
            <View style={styles.biometricContainer}>
              <Typography style={styles.biometricIcon}>
                🔒
              </Typography>
              
              {isLoading ? (
                <ActivityIndicator 
                  size="large" 
                  color={theme.colors.primary.main} 
                  style={styles.loader}
                />
              ) : (
                <Typography variant="body2" style={styles.instructionText}>
                  {attemptCount === 0 
                    ? 'Iniciando autenticación...' 
                    : `Intento ${attemptCount} de 2`
                  }
                </Typography>
              )}
            </View>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <Button
                variant="outlined"
                color="primary"
                onPress={handleBiometricAuth}
                disabled={isLoading}
                style={styles.retryButton}
              >
                {isLoading ? 'Autenticando...' : 'Reintentar'}
              </Button>
              
              {showFallback && (
                <Button
                  variant="contained"
                  color="secondary"
                  onPress={onFallbackToLogin}
                  style={styles.fallbackButton}
                >
                  Usar contraseña
                </Button>
              )}
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backgroundMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  authCard: {
    padding: 32,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    elevation: 12,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoText: {
    color: theme.colors.common.white,
    fontWeight: '800',
    fontSize: 32,
    letterSpacing: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  authSection: {
    width: '100%',
    alignItems: 'center',
  },
  biometricContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  biometricIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  loader: {
    marginTop: 16,
  },
  instructionText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    width: '100%',
  },
  fallbackButton: {
    width: '100%',
  },
});

export default BiometricAuth;
