import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Pdf from 'react-native-pdf';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSession } from '../../context/SessionContext';
import { StorageManager } from '../../utils/storage';

interface DocumentoPDFScreenProps {
  route: { params: { idDocumento: string } };
}


const DocumentoPDFScreen: React.FC<DocumentoPDFScreenProps> = ({ route }) => {
  const { idDocumento } = route.params;
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSession();

  useEffect(() => {
    const fetchPDF = async () => {
      console.log('[DocumentoPDFScreen] Iniciando fetchPDF para idDocumento:', idDocumento);
      try {
        if (!token) throw new Error('No hay token de sesión');
        const config = await StorageManager.getAppConfig();
        console.log('[DocumentoPDFScreen] Configuración obtenida:', config);
        if (!config || !(config as any).serverUrl) throw new Error('No se encontró la URL base en la configuración');
        let baseUrl = (config as any).serverUrl;
        if (!baseUrl.endsWith('/')) baseUrl += '/';
        const url = `${baseUrl}documentos/getFileContent`;
        const body = {
          token,
          idFile: idDocumento,
          // Puedes añadir más campos si el backend lo requiere
        };
        console.log('[DocumentoPDFScreen] URL de petición PDF:', url);
        console.log('[DocumentoPDFScreen] Body petición PDF:', body);
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        console.log('[DocumentoPDFScreen] Respuesta recibida:', response.status);
        const data = await response.json();
        console.log('[DocumentoPDFScreen] Data recibida:', data);
        if (data.Result) {
          setPdfBase64(data.Result);
          console.log('[DocumentoPDFScreen] PDF base64 seteado correctamente.');
        } else {
          console.error('[DocumentoPDFScreen] No se pudo obtener el PDF. Data:', data);
          Alert.alert('Error', 'No se pudo obtener el PDF');
        }
      } catch (error) {
        console.error('[DocumentoPDFScreen] Error al obtener el PDF:', error);
        Alert.alert('Error', 'Error al obtener el PDF');
      } finally {
        setLoading(false);
        console.log('[DocumentoPDFScreen] setLoading(false)');
      }
    };
    fetchPDF();
  }, [idDocumento, token]);

  if (loading) {
    console.log('[DocumentoPDFScreen] Renderizando loading...');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!pdfBase64) {
    console.log('[DocumentoPDFScreen] No se pudo cargar el PDF.');
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No se pudo cargar el PDF.</Text>
      </View>
    );
  }

  console.log('[DocumentoPDFScreen] Renderizando PDF.');
  return (
    <View style={styles.pdfScreenContainer}>
      <View style={styles.pdfGrowContainer}>
        <Pdf
          source={{ uri: `data:application/pdf;base64,${pdfBase64}` }}
          style={styles.pdf}
          onError={err => {
            console.error('[DocumentoPDFScreen] Error al mostrar el PDF:', err);
            Alert.alert('Error', 'No se pudo mostrar el PDF');
          }}
        />
      </View>
      <View style={styles.touchIconContainer}>
        <MaterialIcons name="touch-app" size={44} color="#666CFF" />
        <Text style={styles.touchText}>Toca o haz zoom en el PDF</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    padding: 24,
  },
  pdfScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  pdfGrowContainer: {
    flex: 1,
    minHeight: 0,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: undefined,
    minHeight: 200,
  },
  touchIconContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  touchText: {
    color: '#666CFF',
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DocumentoPDFScreen;
