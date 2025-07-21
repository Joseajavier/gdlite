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
import Clipboard from '@react-native-clipboard/clipboard';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Card } from '../../components/Card';
import { theme } from '../../styles/theme';
import { AppConfigData } from '../../utils/storage';

interface QRGeneratorProps {
  onClose?: () => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  
  // Estados para los datos de configuración
  const [configData, setConfigData] = useState<AppConfigData>({
    serverUrl: 'https://api.gdlite.com',
    apiKey: 'your-api-key-here',
    organizationId: 'org-123456',
    userId: 'user-123456',
    sessionToken: 'session-token-example',
    refreshToken: 'refresh-token-example',
    clientId: 'client-id-example',
    clientSecret: 'client-secret-example',
    environment: 'production',
    lastLoginDate: new Date().toISOString(),
  });

  const handleInputChange = (field: keyof AppConfigData, value: string) => {
    setConfigData(prev => ({ ...prev, [field]: value }));
  };

  const generateQR = async () => {
    setIsGenerating(true);
    try {
      // Crear el JSON con los datos de configuración
      const jsonData = JSON.stringify(configData, null, 2);
      
      // Simular la generación del QR
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setQrData(jsonData);
      
      Alert.alert(
        'QR Generado',
        'El código QR se ha generado correctamente. Puedes copiarlo al portapapeles.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error generating QR:', error);
      Alert.alert('Error', 'No se pudo generar el código QR');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (qrData) {
      await Clipboard.setString(qrData);
      Alert.alert('Copiado', 'Los datos se han copiado al portapapeles');
    }
  };

  const clearData = () => {
    setQrData(null);
    setConfigData({
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.default} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Card style={styles.generatorCard}>
            {/* Header */}
            <View style={styles.headerSection}>
              <Typography variant="h2" style={styles.title}>
                Generador de QR
              </Typography>
              <Typography variant="body1" style={styles.subtitle}>
                Crea un código QR con los datos de configuración
              </Typography>
            </View>

            {/* Formulario */}
            <View style={styles.formContainer}>
              <TextField
                label="URL del Servidor"
                value={configData.serverUrl}
                onChangeText={(text) => handleInputChange('serverUrl', text)}
                placeholder="https://api.ejemplo.com"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextField
                label="API Key"
                value={configData.apiKey}
                onChangeText={(text) => handleInputChange('apiKey', text)}
                placeholder="Tu API Key"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextField
                label="Organization ID"
                value={configData.organizationId}
                onChangeText={(text) => handleInputChange('organizationId', text)}
                placeholder="org-123456"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextField
                label="User ID"
                value={configData.userId}
                onChangeText={(text) => handleInputChange('userId', text)}
                placeholder="user-123456"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextField
                label="Client ID"
                value={configData.clientId}
                onChangeText={(text) => handleInputChange('clientId', text)}
                placeholder="client-id-example"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextField
                label="Client Secret"
                value={configData.clientSecret}
                onChangeText={(text) => handleInputChange('clientSecret', text)}
                placeholder="client-secret-example"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </View>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <Button
                variant="outlined"
                color="primary"
                onPress={clearData}
                style={styles.button}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onPress={generateQR}
                disabled={isGenerating}
                style={styles.button}
              >
                {isGenerating ? (
                  <ActivityIndicator size="small" color={theme.colors.common.white} />
                ) : (
                  'Generar QR'
                )}
              </Button>
            </View>

            {/* Resultado */}
            {qrData && (
              <View style={styles.resultContainer}>
                <Typography variant="h3" style={styles.resultTitle}>
                  Datos del QR:
                </Typography>
                
                <View style={styles.qrMock}>
                  <Typography variant="h1" style={styles.qrIcon}>
                    📱
                  </Typography>
                  <Typography variant="body2" style={styles.qrText}>
                    Código QR Generado
                  </Typography>
                </View>

                <View style={styles.dataContainer}>
                  <Typography variant="body2" style={styles.dataText}>
                    {qrData}
                  </Typography>
                </View>

                <View style={styles.resultButtons}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onPress={copyToClipboard}
                    style={styles.resultButton}
                  >
                    📋 Copiar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onPress={onClose}
                    style={styles.resultButton}
                  >
                    ✅ Listo
                  </Button>
                </View>
              </View>
            )}

            {/* Botón cerrar */}
            <Button
              variant="outlined"
              color="secondary"
              onPress={onClose}
              style={styles.closeButton}
            >
              Cerrar
            </Button>
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
    flexGrow: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  generatorCard: {
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
    gap: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: theme.colors.background.paper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  resultTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  qrMock: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 20,
    backgroundColor: theme.colors.common.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.divider,
  },
  qrIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  qrText: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  dataContainer: {
    backgroundColor: theme.colors.background.default,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 200,
  },
  dataText: {
    color: theme.colors.text.secondary,
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  resultButton: {
    flex: 1,
  },
  closeButton: {
    marginTop: 16,
  },
});

export default QRGenerator;
