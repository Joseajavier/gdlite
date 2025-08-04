import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import UserInfo from './UserInfo';

interface UserInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <UserInfo />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Typography style={styles.closeText}>Cerrar</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 280,
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#666CFF',
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserInfoModal;
