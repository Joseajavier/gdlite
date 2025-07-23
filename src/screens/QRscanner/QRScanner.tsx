import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Text, View, StyleSheet } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import { useEffect } from 'react';

const QRScanner = () => {
  const onSuccess = (e: { data: string }) => {
    console.log('QR leído:', e.data);
  };
useEffect(() => {
  const askPermission = async () => {
    const result = await request(
      Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
    );
    console.log('🔍 Permiso de cámara:', result);
  };
  askPermission();
}, []);
  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        showMarker
        reactivate
        topContent={<Text style={styles.text}>Escanea el código QR</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: { fontSize: 18, padding: 16, textAlign: 'center' },
});

export default QRScanner;
