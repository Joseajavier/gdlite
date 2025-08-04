import React, { useState } from 'react';
import { Modal, View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { theme } from '../../styles/theme';

interface FirmarDocumentoModalProps {
  visible: boolean;
  onClose: () => void;
  onFirmar: (certificado: string, password: string, motivo: string) => void;
  certificados: string[];
}

const FirmarDocumentoModal: React.FC<FirmarDocumentoModalProps> = ({ visible, onClose, onFirmar, certificados }) => {
  const [certificado, setCertificado] = useState(certificados[0] || '');
  const [password, setPassword] = useState('');
  const [motivo, setMotivo] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Firmar Documento</Text>
          <Text style={styles.label}>Seleccione certificado*</Text>
          <View style={styles.selectBox}>
            <TextInput
              style={styles.input}
              value={certificado}
              onChangeText={setCertificado}
              placeholder="Certificado"
              autoCapitalize="none"
            />
          </View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña*"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={motivo}
            onChangeText={setMotivo}
            placeholder="Motivo firma"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.firmarBtn} onPress={() => onFirmar(certificado, password, motivo)}>
              <Text style={styles.firmarBtnText}>Firmar</Text>
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
  label: {
    color: theme.colors.primary.main,
    fontSize: 15,
    marginBottom: 2,
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  selectBox: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
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
  firmarBtn: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 12,
  },
  firmarBtnText: {
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

export default FirmarDocumentoModal;
