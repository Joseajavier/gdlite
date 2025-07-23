

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { requestUserPermission, listenForMessages, getFcmToken } from './src/services/pushNotifications';
import { request, PERMISSIONS } from 'react-native-permissions';



const App: React.FC = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);


useEffect(() => {
  const testPermissions = async () => {
    const res = await request(PERMISSIONS.IOS.CAMERA);
    console.log('🟢 Permiso cámara:', res);
  };
  testPermissions();
}, []);


  useEffect(() => {
    requestUserPermission();
    listenForMessages();
    getFcmToken().then(token => {
      setFcmToken(token || null);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
      {fcmToken && (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenTitle}>FCM Token:</Text>
          <Text selectable style={styles.tokenText}>{fcmToken}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tokenContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  tokenTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 12,
    color: '#333',
  },
});

export default App;
