import React, { useState } from 'react';
import { Modal, View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { theme } from '../../styles/theme';

interface RechazarFirmaModalProps {
  visible: boolean;
  onClose: () => void;
  onRechazar: (motivo: string) => void;
}

const RechazarFirmaModal: React.FC<RechazarFirmaModalProps> = ({ visible, onClose, onRechazar }) => {
  const [motivo, setMotivo] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Rechazar Firma</Text>
          <TextInput
            style={styles.input}
            value={motivo}
            onChangeText={setMotivo}
            placeholder="Motivo rechazo"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.rechazarBtn} onPress={() => onRechazar(motivo)}>
              <Text style={styles.rechazarBtnText}>Rechazar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelarBtn} onPress={onClose}>
              <Text style={styles.cancelarBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    width: 380,
    maxWidth: '95%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    width: 300,
    fontSize: 16,
    backgroundColor: '#fafbff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  rechazarBtn: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 12,
  },
  rechazarBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  cancelarBtn: {
    backgroundColor: '#f5f5ff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  cancelarBtnText: {
    color: theme.colors.primary.main,
    fontWeight: '700',
    fontSize: 18,
  },
});

export default RechazarFirmaModal;
