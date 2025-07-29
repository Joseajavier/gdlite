import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import MainLayout from '../../components/MainLayout';
import { theme } from '../../styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


import { StorageManager } from '../../utils/storage';
import { useSession } from '../../context/SessionContext';

const DetalleFirmaDemoWebView = ({ navigation, route }: any) => {
  console.log('[DemoWebView] Render start');

  const { token } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    const loadPdfUrl = async () => {
      try {
        const config = await StorageManager.getAppConfig();
        if (!config || !(config as any).UrlSwagger) throw new Error('No se encontró la URL base en la configuración');
        let baseUrl = (config as any).UrlSwagger;
        if (!baseUrl.endsWith('/')) baseUrl += '/';
        const idDocumento = route?.params?.idDocumento;
        if (!idDocumento) throw new Error('No se proporcionó idDocumento');
        if (!token) throw new Error('No se proporcionó token');
        const url = `${baseUrl}documentos/getFile`;
        const bodyObj = { token, id: idDocumento };
        console.log('[PDF] fetch body:', bodyObj);
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyObj)
        });
        console.log('[PDF] response status:', response.status);
        const text = await response.text();
        console.log('[PDF] raw response text:', text);
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error('Respuesta no es JSON válido');
        }
        console.log('[PDF] parsed response:', data);
        if (!response.ok) throw new Error('Error al obtener el PDF');
        if (!data?.url) throw new Error('No se encontró la URL del PDF en la respuesta');
        setPdfUrl(data.url);
        console.log('[PDF] url:', data.url);
      } catch (err: any) {
        setError(err.message || 'Error al obtener la URL del PDF');
      }
    };
    loadPdfUrl();
    return () => { console.log('[useEffect] componentWillUnmount'); };
  }, [route?.params?.idDocumento, token]);

  const onPanGestureEvent = (event: any) => {
    if (
      event.nativeEvent.state === State.END &&
      event.nativeEvent.translationX > 60
    ) {
      console.log('[Pan] Swipe right → goBack');
      navigation.goBack();
    }
  };

  const nombreDocumento = route?.params?.nombreDocumento || 'Documento';
  return (
    <MainLayout
      title={nombreDocumento}
      navbarBgColor={theme.colors.primary.main}
      navbarTextColor="#fff"
      bottomNav={
        <View style={styles.bottomNav}>
          {[
            { name: 'Firmar', icon: 'edit-document', label: 'Firmar' },
            { name: 'ComprobarFirma', icon: 'verified', label: 'Comprobar firma' },
            { name: 'Rechazar', icon: 'block', label: 'Rechazar' },
            { name: 'NoLeido', icon: 'remove-red-eye', label: 'No leído' },
          ].map((tab, i) => (
            <TouchableOpacity
              key={i}
              style={styles.navItem}
              // onPress={() => {}}
            >
              <MaterialIcons
                name={tab.icon}
                size={28}
                color={theme.colors.primary.main}
                style={styles.navIcon}
              />
              <Text style={styles.navText}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      }
    >
      <View style={styles.centerContent}>
        <PanGestureHandler
          onHandlerStateChange={onPanGestureEvent}
          activeOffsetX={20}
        >
          <View style={{ flex: 1 }}>
            {error ? (
              <Text style={styles.errorText}>Error: {error}</Text>
            ) : (
              <WebView
                source={{ uri: pdfUrl }}
                style={styles.webview}
                onLoadStart={() => {
                  console.log('[WebView] onLoadStart');
                  setLoading(true);
                }}
                onLoad={() => {
                  console.log('[WebView] onLoad');
                }}
                onLoadEnd={() => {
                  console.log('[WebView] onLoadEnd');
                  setLoading(false);
                }}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('[WebView] onError', nativeEvent);
                  setError(nativeEvent.description);
                  setLoading(false);
                }}
                startInLoadingState={false}
              />
            )}
            {loading && !error && (
              <ActivityIndicator
                size="large"
                color={theme.colors.primary.main}
                style={styles.loader}
              />
            )}
          </View>
        </PanGestureHandler>
      </View>
    </MainLayout>
  );
};

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    marginBottom: 2,
  },
  navText: {
    fontSize: 10,
    color: theme.colors.primary.main,
  },
  centerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 16,
  },
  webview: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 100, // ajusta según tu navbar/status
    backgroundColor: '#eee',
  },
  loader: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 20,
    left: SCREEN_WIDTH / 2 - 20,
  },
});

export default DetalleFirmaDemoWebView;
