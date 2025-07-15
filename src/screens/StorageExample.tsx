import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../styles/theme';
import { useAppConfig, useStorage, useUserPreferences, useBiometricSettings, useLastLogin } from '../hooks/useStorage';

const StorageExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Usar los hooks personalizados
  const { config, isConfigured, saveConfig, clearConfig } = useAppConfig();
  const { data: customData, saveData: saveCustomData } = useStorage('custom_data', {});
  const { preferences, updatePreference } = useUserPreferences();
  const { isEnabled: biometricEnabled, setBiometricEnabled } = useBiometricSettings();
  const { lastLogin, saveLastLogin } = useLastLogin();

  // Ejemplo de guardar datos de configuración
  const handleSaveExampleConfig = async () => {
    setIsLoading(true);
    try {
      const exampleConfig = {
        serverUrl: 'https://api.ejemplo.com',
        apiKey: 'tu-api-key-aqui',
        organizationId: 'org-123456',
        userId: 'user-123456',
        sessionToken: 'session-token-ejemplo',
        refreshToken: 'refresh-token-ejemplo',
        clientId: 'client-id-ejemplo',
        clientSecret: 'client-secret-ejemplo',
        environment: 'production' as const,
        lastLoginDate: new Date().toISOString(),
      };

      const success = await saveConfig(exampleConfig);
      if (success) {
        Alert.alert('Éxito', 'Configuración guardada correctamente');
      } else {
        Alert.alert('Error', 'No se pudo guardar la configuración');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  // Ejemplo de guardar datos personalizados
  const handleSaveCustomData = async () => {
    const customInfo = {
      userName: 'Usuario Ejemplo',
      theme: 'dark',
      notifications: true,
      language: 'es',
      lastAccess: new Date().toISOString(),
    };

    const success = await saveCustomData(customInfo);
    if (success) {
      Alert.alert('Éxito', 'Datos personalizados guardados');
    }
  };

  // Ejemplo de actualizar preferencias
  const handleUpdatePreferences = async () => {
    const success = await updatePreference('theme', 'dark');
    if (success) {
      Alert.alert('Éxito', 'Preferencia actualizada');
    }
  };

  // Ejemplo de toggle biométrico
  const handleToggleBiometric = async () => {
    const success = await setBiometricEnabled(!biometricEnabled);
    if (success) {
      Alert.alert('Éxito', `Biometría ${!biometricEnabled ? 'activada' : 'desactivada'}`);
    }
  };

  // Ejemplo de guardar último login
  const handleSaveLastLogin = async () => {
    const loginData = {
      user: 'admin',
      loginTime: new Date().toISOString(),
      sessionId: 'session_' + Date.now(),
      deviceInfo: 'iPhone 14',
    };

    const success = await saveLastLogin(loginData);
    if (success) {
      Alert.alert('Éxito', 'Último login guardado');
    }
  };

  // Limpiar todos los datos
  const handleClearAllData = async () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres limpiar todos los datos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            const success = await clearConfig();
            if (success) {
              Alert.alert('Éxito', 'Todos los datos han sido eliminados');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.default} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Typography variant="h2" style={styles.title}>
            Ejemplo de Storage
          </Typography>
          
          <Typography variant="body1" style={styles.subtitle}>
            Gestiona los datos locales de tu aplicación
          </Typography>

          {/* Estado actual */}
          <Card style={styles.statusCard}>
            <Typography variant="h3" style={styles.cardTitle}>
              Estado Actual
            </Typography>
            <Typography variant="body1" style={styles.statusText}>
              App configurada: {isConfigured ? '✅ Sí' : '❌ No'}
            </Typography>
            <Typography variant="body1" style={styles.statusText}>
              Biometría: {biometricEnabled ? '✅ Activada' : '❌ Desactivada'}
            </Typography>
            <Typography variant="body1" style={styles.statusText}>
              Último login: {lastLogin ? new Date(lastLogin.timestamp).toLocaleString() : 'Ninguno'}
            </Typography>
          </Card>

          {/* Datos guardados */}
          <Card style={styles.dataCard}>
            <Typography variant="h3" style={styles.cardTitle}>
              Datos Guardados
            </Typography>
            
            {config && (
              <View style={styles.dataSection}>
                <Typography variant="body1" style={styles.dataLabel}>
                  Configuración:
                </Typography>
                <Typography variant="body2" style={styles.dataValue}>
                  Server: {config.serverUrl}
                </Typography>
                <Typography variant="body2" style={styles.dataValue}>
                  Org ID: {config.organizationId}
                </Typography>
                <Typography variant="body2" style={styles.dataValue}>
                  Environment: {config.environment}
                </Typography>
              </View>
            )}

            {customData && Object.keys(customData).length > 0 && (
              <View style={styles.dataSection}>
                <Typography variant="body1" style={styles.dataLabel}>
                  Datos Personalizados:
                </Typography>
                <Typography variant="body2" style={styles.dataValue}>
                  {JSON.stringify(customData, null, 2)}
                </Typography>
              </View>
            )}

            {preferences && Object.keys(preferences).length > 0 && (
              <View style={styles.dataSection}>
                <Typography variant="body1" style={styles.dataLabel}>
                  Preferencias:
                </Typography>
                <Typography variant="body2" style={styles.dataValue}>
                  {JSON.stringify(preferences, null, 2)}
                </Typography>
              </View>
            )}
          </Card>

          {/* Botones de acción */}
          <Card style={styles.actionsCard}>
            <Typography variant="h3" style={styles.cardTitle}>
              Acciones
            </Typography>
            
            <View style={styles.buttonGrid}>
              <Button
                variant="contained"
                color="primary"
                onPress={handleSaveExampleConfig}
                disabled={isLoading}
                style={styles.actionButton}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.common.white} />
                ) : (
                  'Guardar Config'
                )}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onPress={handleSaveCustomData}
                style={styles.actionButton}
              >
                Guardar Datos
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onPress={handleUpdatePreferences}
                style={styles.actionButton}
              >
                Actualizar Prefs
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onPress={handleToggleBiometric}
                style={styles.actionButton}
              >
                Toggle Biometría
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onPress={handleSaveLastLogin}
                style={styles.actionButton}
              >
                Guardar Login
              </Button>

              <Button
                variant="outlined"
                color="error"
                onPress={handleClearAllData}
                style={styles.actionButton}
              >
                Limpiar Todo
              </Button>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: theme.colors.text.secondary,
  },
  statusCard: {
    padding: 16,
    marginBottom: 16,
  },
  dataCard: {
    padding: 16,
    marginBottom: 16,
  },
  actionsCard: {
    padding: 16,
  },
  cardTitle: {
    marginBottom: 16,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  statusText: {
    marginBottom: 8,
    color: theme.colors.text.primary,
  },
  dataSection: {
    marginBottom: 16,
  },
  dataLabel: {
    marginBottom: 4,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  dataValue: {
    marginBottom: 4,
    color: theme.colors.text.secondary,
    fontFamily: 'monospace',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: 120,
  },
});

export default StorageExample;
