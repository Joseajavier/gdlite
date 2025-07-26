import React from 'react';
import { Avatar } from '../../components/Avatar';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/Typography';
import { theme } from '../../styles/theme';

interface AvisoDetalleProps {
  aviso: any;
  onClose: () => void;
  onReenviar: () => void;
  onResponder: () => void;
  onMarcarNoLeido: () => void;
}

const AvisoDetalle: React.FC<AvisoDetalleProps> = ({ aviso, onClose, onReenviar, onResponder, onMarcarNoLeido }) => {
  // Formatear fecha corta
  const rawFecha = aviso?.Fecha || aviso?.fecha || '';
  let fechaCorta = '';
  if (rawFecha && typeof rawFecha === 'string') {
    const d = new Date(rawFecha);
    if (!isNaN(d.getTime())) {
      const pad = (n: number) => n < 10 ? '0' + n : n;
      const yearShort = d.getFullYear().toString().slice(-2);
      fechaCorta = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${yearShort} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } else {
      fechaCorta = rawFecha;
    }
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Avatar src={aviso?.ImgUsuario || undefined} size={54} style={styles.avatarMargin} />
          <View>
            <Typography style={styles.senderText}>{aviso?.nombreUsuario || 'Sin usuario'}</Typography>
            <Typography style={styles.jobText}>{aviso?.puesto || 'Sin puesto'}</Typography>
          </View>
        </View>
        <Typography style={styles.dateText}>{fechaCorta || 'Sin fecha'}</Typography>
      </View>
      <View style={styles.bodyBlock}>
        <Typography style={styles.subjectText}>{aviso?.asunto || aviso?.comentario || 'Sin asunto'}</Typography>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={onReenviar}>
          <Text style={styles.bottomButtonText}>Reenviar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={onResponder}>
          <Text style={styles.bottomButtonText}>Responder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={onMarcarNoLeido}>
          <Text style={styles.bottomButtonText}>No leído</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateBelow: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '400',
    marginTop: 10,
    textAlign: 'left',
  },
  avatarMargin: {
    marginRight: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButtonText: {
    fontSize: 28,
    color: theme.colors.primary.main,
    fontWeight: 'bold',
    marginTop: -2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: theme.colors.primary.main,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 24,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F3F3FF',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  senderText: {
    fontSize: 17,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  jobText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '400',
  },
  dateText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    textAlign: 'right',
    minWidth: 120,
  },
  bodyBlock: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  subjectText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'left',
  },
  bottomButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  bottomButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AvisoDetalle;
