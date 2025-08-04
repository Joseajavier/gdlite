import React, { useState } from 'react';
import { Modal, View, StyleSheet, TextInput, TouchableOpacity, Text, Pressable } from 'react-native';
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
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
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
        </Pressable>
      </Pressable>
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
    borderRadius: 14, // Reducido de 16 a 14
    padding: 20, // Reducido de 28 a 20
    width: 340, // Reducido de 380 a 340
    maxWidth: '90%', // Reducido de 95% a 90%
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22, // Reducido de 28 a 22
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 14, // Reducido de 18 a 14
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6, // Reducido de 8 a 6
    padding: 10, // Reducido de 12 a 10
    marginBottom: 14, // Reducido de 18 a 14
    width: 280, // Reducido de 300 a 280
    fontSize: 14, // Reducido de 16 a 14
    backgroundColor: '#fafbff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8, // Reducido de 10 a 8
  },
  rechazarBtn: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 6, // Reducido de 8 a 6
    paddingVertical: 10, // Reducido de 12 a 10
    paddingHorizontal: 24, // Reducido de 32 a 24
    marginRight: 10, // Reducido de 12 a 10
  },
  rechazarBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16, // Reducido de 18 a 16
  },
  cancelarBtn: {
    backgroundColor: '#f5f5ff',
    borderRadius: 6, // Reducido de 8 a 6
    paddingVertical: 10, // Reducido de 12 a 10
    paddingHorizontal: 24, // Reducido de 32 a 24
  },
  cancelarBtnText: {
    color: theme.colors.primary.main,
    fontWeight: '700',
    fontSize: 16, // Reducido de 18 a 16
  },
});

export default RechazarFirmaModal;
