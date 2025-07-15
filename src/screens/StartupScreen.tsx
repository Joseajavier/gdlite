import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../styles/theme';
import { useAppStartup, AppStartupState } from '../hooks/useAppStartup';

interface StartupScreenProps {
  onNeedQRConfig: () => void;
  onNeedBiometricAuth: () => void;
  onNeedLogin: () => void;
  onAuthenticated: () => void;
}

const StartupScreen: React.FC<StartupScreenProps> = ({
  onNeedQRConfig,
  onNeedBiometricAuth,
  onNeedLogin,
  onAuthenticated,
}) => {
  const {
    state,
    error,
    retryStartup,
    resetToQRConfig,
    skipBiometricAuth,
    isLoading,
    hasError,
  } = useAppStartup({
    onStateChange: (newState) => {
      // Navegar automáticamente según el estado
      switch (newState) {
        case AppStartupState.NEED_QR_CONFIG:
          onNeedQRConfig();
          break;
        case AppStartupState.NEED_BIOMETRIC_AUTH:
          onNeedBiometricAuth();
          break;
        case AppStartupState.NEED_LOGIN:
          onNeedLogin();
          break;
        case AppStartupState.AUTHENTICATED:
          onAuthenticated();
          break;
      }
    },
  });

  const handleRetry = () => {
    retryStartup();
  };

  const handleResetConfig = () => {
    Alert.alert(
      'Resetear Configuración',
      '¿Estás seguro de que quieres eliminar la configuración actual? Tendrás que escanear el código QR nuevamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resetear', style: 'destructive', onPress: resetToQRConfig },
      ]
    );
  };

  const getStatusMessage = (): string => {
    switch (state) {
      case AppStartupState.LOADING:
        return 'Inicializando aplicación...';
      case AppStartupState.NEED_QR_CONFIG:
        return 'Configuración requerida';
      case AppStartupState.NEED_BIOMETRIC_AUTH:
        return 'Autenticando...';
      case AppStartupState.NEED_LOGIN:
        return 'Redirigiendo al login...';
      case AppStartupState.AUTHENTICATED:
        return 'Acceso autorizado';
      case AppStartupState.ERROR:
        return 'Error de inicialización';
      default:
        return 'Preparando...';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.main} />
        
        <View style={styles.content}>
          <Card style={styles.loadingCard}>
            <View style={styles.logoContainer}>
              <Typography variant="h1" style={styles.logoText}>
                GdLite
              </Typography>
            </View>
            
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary.main} />
              <Typography variant="body1" style={styles.statusText}>
                {getStatusMessage()}
              </Typography>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.error.main} />
        
        <View style={styles.content}>
          <Card style={styles.errorCard}>
            <View style={styles.logoContainer}>
              <Typography variant="h1" style={styles.logoText}>
                GdLite
              </Typography>
            </View>
            
            <View style={styles.errorContainer}>
              <Typography variant="h3" style={styles.errorTitle}>
                Error de Inicialización
              </Typography>
              
              <Typography variant="body1" style={styles.errorMessage}>
                {error || 'Ha ocurrido un error inesperado durante el inicio de la aplicación.'}
              </Typography>
              
              <View style={styles.buttonContainer}>
                <Button
                  variant="outlined"
                  color="primary"
                  onPress={handleResetConfig}
                  style={styles.button}
                >
                  Resetear Config
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onPress={handleRetry}
                  style={styles.button}
                >
                  Reintentar
                </Button>
              </View>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  // Para estados intermedios que no requieren UI específica
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.main} />
      
      <View style={styles.content}>
        <Card style={styles.loadingCard}>
          <View style={styles.logoContainer}>
            <Typography variant="h1" style={styles.logoText}>
              GdLite
            </Typography>
          </View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Typography variant="body1" style={styles.statusText}>
              {getStatusMessage()}
            </Typography>
            
            {state === AppStartupState.NEED_BIOMETRIC_AUTH && (
              <Button
                variant="outlined"
                color="primary"
                onPress={skipBiometricAuth}
                style={styles.skipButton}
              >
                Usar Login Manual
              </Button>
            )}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  loadingCard: {
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  errorCard: {
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  logoContainer: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 32,
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
  loadingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  statusText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginTop: 8,
  },
  errorContainer: {
    alignItems: 'center',
    width: '100%',
  },
  errorTitle: {
    color: theme.colors.error.main,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  errorMessage: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
  },
  skipButton: {
    marginTop: 16,
    minWidth: 200,
  },
});

export default StartupScreen;
