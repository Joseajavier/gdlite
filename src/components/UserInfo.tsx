import React from 'react';
import { View, Text, StyleSheet, Image, Platform, ScrollView } from 'react-native';
import { useSession } from '../context/SessionContext';

const UserInfo = () => {
  const { user, token } = useSession();

  if (!user) {
    return <Text style={styles.info}>No hay usuario en sesión.</Text>;
  }

  // Extraer campos principales para destacar
  const nombre = user.NombreCompleto || user.Nombre || '';
  const email = user.email || user.Email || '';
  const imagen = user.Imagen || user.ImgUsuario || '';


  return (
    <View style={styles.container}>
      {imagen ? (
        <Image source={{ uri: imagen }} style={styles.avatar} />
      ) : null}
      <Text style={styles.infoTitle}>{nombre}</Text>
      {email ? <Text style={styles.infoEmail}>{email}</Text> : null}
      <Text style={styles.infoToken}>Token: {token ? token.substring(0, 8) + '...' : ''}</Text>
      {/* Mostrar el resto del objeto user como JSON legible */}
      <Text style={styles.sectionTitle}>Datos completos de sesión:</Text>
      <View style={styles.jsonBox}>
        <ScrollView horizontal={true} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <Text style={styles.jsonText} selectable>
              {JSON.stringify(user, null, 2)}
            </Text>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  infoEmail: {
    fontSize: 15,
    color: '#666CFF',
    marginBottom: 2,
    textAlign: 'center',
  },
  infoToken: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'left',
  },
  jsonBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 10,
    marginTop: 2,
    maxHeight: 220,
    minWidth: 260,
  },
  jsonText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    color: '#222',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
});

export default UserInfo;
