import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { Card } from '../components/Card';
import { theme } from '../styles/theme';
import { StorageManager, AppConfigData } from '../utils/storage';
import KeychainService from '../services/keychainService';

interface AppConfigProps {
  onConfigComplete?: () => void;
  onScanQR?: () => void;
}

const AppConfig: React.FC<AppConfigProps> = ({ onConfigComplete, onScanQR }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para mostrar el modal de configuración legible
  const [showConfigModal, setShowConfigModal] = useState(false);
  // Estados para los 10 datos de configuración
  const [configData, setConfigData] = useState<AppConfigData>({
    serverUrl: '',
    apiKey: '',
    organizationId: '',
    userId: '',
    sessionToken: '',
    refreshToken: '',
    clientId: '',
    clientSecret: '',
    environment: 'production',
    lastLoginDate: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Partial<AppConfigData>>({});

  // Borrar toda la configuración y datos
  const handleFullReset = async () => {
    try {
      await StorageManager.clearAllData();
      await KeychainService.clearAll();
      Alert.alert('Reseteo completo', 'Todos los datos han sido eliminados.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo borrar toda la información.');
    }
  };

  useEffect(() => {
    loadExistingConfig();
  }, []);

  const loadExistingConfig = async () => {
    setIsLoading(true);
    try {
      const existingConfig = await StorageManager.getAppConfig();
      if (existingConfig) {
        setConfigData(existingConfig);
      }
    } catch (error) {
      console.error('Error loading existing config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AppConfigData> = {};
    
    if (!configData.serverUrl.trim()) {
      newErrors.serverUrl = 'URL del servidor es obligatorio';
    }
    
    if (!configData.apiKey.trim()) {
      newErrors.apiKey = 'API Key es obligatorio';
    }
    
    if (!configData.organizationId.trim()) {
      newErrors.organizationId = 'ID de organización es obligatorio';
    }
    
    if (!configData.userId.trim()) {
      newErrors.userId = 'ID de usuario es obligatorio';
    }
    
    if (!configData.clientId.trim()) {
      newErrors.clientId = 'Client ID es obligatorio';
    }
    
    if (!configData.clientSecret.trim()) {
      newErrors.clientSecret = 'Client Secret es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await StorageManager.saveAppConfig({
        ...configData,
        lastLoginDate: new Date().toISOString(),
      });
      
      Alert.alert(
        'Configuración Guardada',
        'Los datos se han guardado correctamente.',
        [
          {
            text: 'Continuar',
            onPress: () => {
              if (onConfigComplete) {
                onConfigComplete();
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving config:', error);
      Alert.alert('Error', 'No se pudo guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof AppConfigData, value: string) => {
    setConfigData(prev => ({ ...prev, [field]: value }));
    // Limpiar errores al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEnvironmentChange = (environment: 'development' | 'production' | 'staging') => {
    setConfigData(prev => ({ ...prev, environment }));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Typography variant="body1" style={styles.loadingText}>
          Cargando configuración...
        </Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.default} />
      {/* Modal legible de configuración */}
      {showConfigModal && (
        <View style={modalStyles.overlay}>
          <View style={modalStyles.content}>
            <Typography variant="h2" style={modalStyles.title}>Configuración actual</Typography>
            <View style={modalStyles.table}>
              {Object.entries(configData)
                .filter(([_, value]) => value !== undefined && value !== null && value !== '')
                .map(([key, value]) => (
                  <View style={modalStyles.row} key={key}>
                    <Typography style={modalStyles.key}>{getLabel(key)}</Typography>
                    <Typography style={modalStyles.value}>{key === 'lastLoginDate' && value ? new Date(value as string).toLocaleString() : String(value)}</Typography>
                  </View>
                ))}
            </View>
            <Button variant="contained" color="primary" onPress={() => setShowConfigModal(false)} style={modalStyles.closeBtn}>Cerrar</Button>
          </View>
        </View>
// Traduce claves a etiquetas legibles
function getLabel(key: string): string {
  const labels: Record<string, string> = {
    serverUrl: 'Servidor',
    apiKey: 'API Key',
    organizationId: 'Organización',
    userId: 'Usuario',
    sessionToken: 'Token de sesión',
    refreshToken: 'Refresh token',
    clientId: 'Client ID',
    clientSecret: 'Client Secret',
    environment: 'Ambiente',
    lastLoginDate: 'Último login',
  };
  return labels[key] || key;
}
      )}
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Card style={styles.configCard}>
              {/* Header */}
              <View style={styles.headerSection}>
                <Typography variant="h2" style={styles.title}>
                  Configuración de la App
                </Typography>
                <Typography variant="body1" style={styles.subtitle}>
                  Ingresa los 10 datos necesarios para configurar la aplicación o escanea un código QR
                </Typography>
                {/* Botón de QR */}
                <Button
                  variant="outlined"
                  color="primary"
                  onPress={onScanQR}
                  style={styles.qrButton}
                >
                  📱 Escanear QR
                </Button>
                {/* Botón para ver configuración legible */}
                <Button
                  variant="outlined"
                  color="primary"
                  onPress={() => setShowConfigModal(true)}
                  style={styles.qrButton}
                >
                  �️ Ver configuración actual
                </Button>
              </View>

              {/* Formulario de configuración */}
              <View style={styles.formContainer}>
                {/* Server URL */}
                <TextField
                  label="URL del Servidor"
                  placeholder="https://api.ejemplo.com"
                  value={configData.serverUrl}
                  onChangeText={(text) => handleInputChange('serverUrl', text)}
                  error={!!errors.serverUrl}
                  helperText={errors.serverUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* API Key */}
                <TextField
                  label="API Key"
                  placeholder="Tu clave de API"
                  value={configData.apiKey}
                  onChangeText={(text) => handleInputChange('apiKey', text)}
                  error={!!errors.apiKey}
                  helperText={errors.apiKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Organization ID */}
                <TextField
                  label="ID de Organización"
                  placeholder="org-123456"
                  value={configData.organizationId}
                  onChangeText={(text) => handleInputChange('organizationId', text)}
                  error={!!errors.organizationId}
                  helperText={errors.organizationId}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* User ID */}
                <TextField
                  label="ID de Usuario"
                  placeholder="user-123456"
                  value={configData.userId}
                  onChangeText={(text) => handleInputChange('userId', text)}
                  error={!!errors.userId}
                  helperText={errors.userId}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Session Token */}
                <TextField
                  label="Token de Sesión"
                  placeholder="Token de sesión (opcional)"
                  value={configData.sessionToken}
                  onChangeText={(text) => handleInputChange('sessionToken', text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Refresh Token */}
                <TextField
                  label="Token de Actualización"
                  placeholder="Refresh token (opcional)"
                  value={configData.refreshToken}
                  onChangeText={(text) => handleInputChange('refreshToken', text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Client ID */}
                <TextField
                  label="Client ID"
                  placeholder="Tu Client ID"
                  value={configData.clientId}
                  onChangeText={(text) => handleInputChange('clientId', text)}
                  error={!!errors.clientId}
                  helperText={errors.clientId}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Client Secret */}
                <TextField
                  label="Client Secret"
                  placeholder="Tu Client Secret"
                  value={configData.clientSecret}
                  onChangeText={(text) => handleInputChange('clientSecret', text)}
                  error={!!errors.clientSecret}
                  helperText={errors.clientSecret}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                />

                {/* Environment Selector */}
                <View style={styles.environmentSection}>
                  <Typography variant="body1" style={styles.environmentLabel}>
                    Ambiente:
                  </Typography>
                  <View style={styles.environmentButtons}>
                    <Button
                      variant={configData.environment === 'development' ? 'contained' : 'outlined'}
                      color="primary"
                      onPress={() => handleEnvironmentChange('development')}
                      style={styles.environmentButton}
                    >
                      Development
                    </Button>
                    <Button
                      variant={configData.environment === 'staging' ? 'contained' : 'outlined'}
                      color="primary"
                      onPress={() => handleEnvironmentChange('staging')}
                      style={styles.environmentButton}
                    >
                      Staging
                    </Button>
                    <Button
                      variant={configData.environment === 'production' ? 'contained' : 'outlined'}
                      color="primary"
                      onPress={() => handleEnvironmentChange('production')}
                      style={styles.environmentButton}
                    >
                      Production
                    </Button>
                  </View>
                </View>

                {/* Botón de guardar */}
                <Button
                  variant="contained"
                  color="primary"
                  onPress={handleSave}
                  disabled={isSaving}
                  style={styles.saveButton}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={theme.colors.common.white} />
                  ) : (
                    'Guardar Configuración'
                  )}
                </Button>
                {/* Botón para borrar toda la configuración y datos */}
                <Button
                  variant="outlined"
                  color="error"
                  onPress={handleFullReset}
                  style={styles.fullResetButton}
                >
                  Borrar toda la configuración y datos
                </Button>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 300,
    maxWidth: 400,
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.text.primary,
    fontWeight: '700',
    fontSize: 22,
  },
  table: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  key: {
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
  },
  value: {
    color: theme.colors.text.secondary,
    flex: 2,
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  closeBtn: {
    marginTop: 8,
    minWidth: 120,
    alignSelf: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.text.secondary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  configCard: {
    padding: 24,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  formContainer: {
    gap: 20,
  },
  environmentSection: {
    marginVertical: 8,
  },
  environmentLabel: {
    marginBottom: 12,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  environmentButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  environmentButton: {
    flex: 1,
    minWidth: 100,
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 16,
  },
  qrButton: {
    marginTop: 16,
    minWidth: 200,
  },
  fullResetButton: {
    marginTop: 16,
  },
});

export default AppConfig;
