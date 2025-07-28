
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import MainLayout from '../../components/MainLayout';
import { Typography } from '../../components/Typography';
import { theme } from '../../styles/theme';

// Puedes restaurar la lógica de fetchDocumento y docData si necesitas cargar PDFs dinámicos

const DetalleFirma = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test de descarga PDF con fetch
  useEffect(() => {
    fetch('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
      .then(res => {
        console.log('Status PDF:', res.status);
        if (!res.ok) throw new Error('No se puede descargar');
        return res.blob();
      })
      .then(blob => console.log('PDF descargado OK', blob))
      .catch(e => console.log('Error fetch PDF', e));
  }, []);
  // Handler para swipe-back
  const onPanGestureEvent = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > 60) {
        navigation.goBack();
      }
    }
  };

  return (
    <MainLayout
      title="Detalle del Documento"
      navbarBgColor={theme.colors.primary.main}
      navbarTextColor="#fff"
      bottomNav={null}
    >
      <View style={styles.centerContent}>
        <PanGestureHandler onHandlerStateChange={onPanGestureEvent} activeOffsetX={20}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
          ) : error ? (
            <Typography style={styles.docText}>Error: {error}</Typography>
          ) : (
            <Pdf
              source={{ uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', cache: true }}
              onLoadComplete={(pages) => console.log('Cargado con', pages, 'páginas')}
              onError={err => {
                console.log('Error PDF:', err);
                setError('No se pudo mostrar el PDF');
              }}
              renderActivityIndicator={() => (
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
              )}
              style={styles.pdf}
            />
          )}
        </PanGestureHandler>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // scrollContent eliminado porque ya no se usa
  docText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#f8f8fa',
    borderRadius: 12,
    minWidth: 320,
    maxWidth: 600,
  },
  pdf: {
    flex: 1,
    backgroundColor: '#eee',
  },
});

export default DetalleFirma;
