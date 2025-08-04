

import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Typography } from '../components/Typography';
import { theme } from '../styles/theme';

const styles = StyleSheet.create({
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
    backgroundColor: '#666CFF',
    borderRadius: 8,
    padding: 8,
  },
  closeBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginTop: 12,
  },
});


interface ConfigModalProps {
  visible: boolean;
  configData: Record<string, any> | null;
  onClose: () => void;
}

export const getLabel = (key: string): string => {
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
};

const ConfigModal: React.FC<ConfigModalProps> = ({ visible, configData, onClose }) => {
  React.useEffect(() => {
    console.log('ConfigModal configData:', configData);
  }, [configData]);


  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Typography variant="h2" style={styles.title}>Configuración actual</Typography>
          <View style={styles.table}>
            {configData && typeof configData === 'object' && Object.keys(configData).length > 0 ? (
              Object.entries(configData).map(([key, value]) => (
                <View style={styles.row} key={key}>
                  <Typography style={styles.key}>{key}</Typography>
                  <Typography style={styles.value}>
                    {typeof value === 'object' && value !== null
                      ? JSON.stringify(value, null, 2)
                      : value !== undefined && value !== null && value !== ''
                        ? String(value)
                        : '-'}
                  </Typography>
                </View>
              ))
            ) : (
              <Typography style={styles.noDataText}>
                {configData === null
                  ? 'No hay datos de configuración guardados (configData es null).'
                  : typeof configData !== 'object'
                    ? 'Error: configData no es un objeto.'
                    : 'No hay datos de configuración guardados.'}
              </Typography>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Typography style={styles.closeBtnText}>Cerrar</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

  );
}

export default ConfigModal;
