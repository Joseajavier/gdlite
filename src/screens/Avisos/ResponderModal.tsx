import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Typography } from '../../components/Typography';

interface ResponderModalProps {
  visible: boolean;
  onClose: () => void;
  onSend: (mensaje: string) => void;
  para: string;
  de: string;
}

const ResponderModal: React.FC<ResponderModalProps> = ({ visible, onClose, onSend, para, de }) => {
  const [mensaje, setMensaje] = useState('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Typography style={styles.title}>Responder Aviso</Typography>
          <View style={styles.row}>
            <Typography style={styles.label}>Para:</Typography>
            <View style={styles.chip}>
              <Typography style={styles.chipText} numberOfLines={1} ellipsizeMode="tail">{para}</Typography>
            </View>
          </View>
          <View style={styles.row}>
            <Typography style={styles.label}>De:</Typography>
            <View style={styles.select}>
              <Typography style={styles.selectText} numberOfLines={1} ellipsizeMode="tail">{de}</Typography>
            </View>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Mensaje nuevo..."
            multiline
            value={mensaje}
            onChangeText={setMensaje}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => onSend(mensaje)}>
              <Typography style={styles.buttonText}>Despachar</Typography>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#888',
    minWidth: 60,
    fontWeight: '600',
  },
  chip: {
    backgroundColor: '#e0e3ea',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
  },
  chipText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  select: {
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  selectText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  textInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#222',
    marginBottom: 18,
    backgroundColor: '#fafbfc',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginTop: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default ResponderModal;
