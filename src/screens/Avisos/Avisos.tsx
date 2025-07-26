import React, { useState } from 'react';
import AvisoDetalle from './AvisoDetalle';
import { useAvisos } from '../../context/AvisosContext';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { Avatar } from '../../components/Avatar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MainLayout from '../../components/MainLayout';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import { Typography } from '../../components/Typography'; // <-- IMPORTANTE

const Avisos: React.FC = () => {
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [avisoActual, setAvisoActual] = useState<any>(null);
  const navigation = useNavigation<NavigationProp<any>>();
  const { avisos } = useAvisos();

  const handleBottomNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  const renderAviso = ({ item }: { item: any }) => {
    // Formatear fecha corta
    const rawFecha = item?.Fecha || item?.fecha || '';
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
      <View style={styles.mailCard}>
        {/* Acciones de correo */}
        <View style={styles.mailActionsRow}>
          <TouchableOpacity style={styles.mailActionIcon}><MaterialIcons name="delete" size={22} color={theme.colors.text.secondary} /></TouchableOpacity>
          <TouchableOpacity style={styles.mailActionIcon}><MaterialIcons name="mail-outline" size={22} color={theme.colors.text.secondary} /></TouchableOpacity>
          <TouchableOpacity style={styles.mailActionIcon}><MaterialIcons name="star-border" size={22} color={theme.colors.text.secondary} /></TouchableOpacity>
          <View style={styles.flex1} />
          <Typography style={styles.mailDateText}>{fechaCorta || 'Sin fecha'}</Typography>
        </View>
        {/* Remitente y puesto */}
        <View style={styles.mailHeaderRow}>
          <View style={styles.rowAlignCenterFlex1}>
            <Avatar src={item?.ImgUsuario || undefined} size={44} style={styles.avatarMargin} />
            <View>
              <Typography style={styles.mailSenderText}>Aviso enviado por: {item?.nombreUsuario || 'Sin usuario'}</Typography>
              <Typography style={styles.mailJobText}>Puesto de Trabajo: {item?.puesto || 'Sin puesto'}</Typography>
            </View>
          </View>
        </View>
        {/* Asunto/cuerpo */}
        <View style={styles.mailSubjectRow}>
          <Typography style={styles.mailSubjectText}>{item?.asunto || item?.comentario || 'Sin asunto'}</Typography>
        </View>
        {/* Footer: Ver Detalle */}
        <View style={styles.cardIconCenterRow}>
          <TouchableOpacity
            onPress={() => {
              setAvisoActual(item);
              setDetalleVisible(true);
            }}
            style={styles.cardFooterButton}
          >
            <MaterialIcons name="touch-app" size={32} color={theme.colors.primary.main} style={styles.touchIconLarge} />
            <Typography style={styles.cardFooterText}>Ver Detalle</Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  // ...existing code...
  return (
    <>
      <MainLayout
        title="Despacho de Asuntos"
        bottomNav={
          <View style={styles.bottomNavigation}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => handleBottomNavigation('home')}
            >
              <Image source={require('../../assets/images/home.gif')} style={styles.navIconGif} resizeMode="contain" />
              <Typography style={styles.navItemText}>Inicio</Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => handleBottomNavigation('portafirmas')}
            >
              <Image source={require('../../assets/images/firma-unscreen.gif')} style={styles.navIconGif} resizeMode="contain" />
              <Typography style={styles.navItemText}>Portafirmas</Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.navItem, styles.navItemActive]}
              onPress={() => handleBottomNavigation('avisos')}
            >
              <Image source={require('../../assets/images/notificacion-unscreen.gif')} style={styles.navIconGifActive} resizeMode="contain" />
              <Typography style={styles.navItemTextActive}>Avisos</Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => handleBottomNavigation('calendario')}
            >
              <Image source={require('../../assets/images/calendar.gif')} style={styles.navIconGif} resizeMode="contain" />
              <Typography style={styles.navItemText}>Calendario</Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => handleBottomNavigation('ia')}
            >
              <Image source={require('../../assets/images/inteligencia-artificial.gif')} style={styles.navIconGif} resizeMode="contain" />
              <Typography style={styles.navItemText}>IA</Typography>
            </TouchableOpacity>
          </View>
        }
        navbarBgColor="#fff"
        navbarTextColor={theme.colors.primary.main}
      >
        <View style={styles.content}>
          <View style={styles.contentArea}>
            {avisos && avisos.length > 0 ? (
              <FlatList
                data={avisos}
                keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
                renderItem={renderAviso}
                contentContainerStyle={styles.firmasListContent}
              />
            ) : (
              <Typography variant="body1" style={styles.sectionSubtitle}>
                No hay avisos disponibles.
              </Typography>
            )}
          </View>
        </View>
      </MainLayout>
      {detalleVisible && (
        <View style={styles.modalFullScreen}>
          <AvisoDetalle
            aviso={avisoActual}
            onClose={() => setDetalleVisible(false)}
            onReenviar={() => { setDetalleVisible(false); Alert.alert('Reenviar', 'Funcionalidad en desarrollo'); }}
            onResponder={() => { setDetalleVisible(false); Alert.alert('Responder', 'Funcionalidad en desarrollo'); }}
            onMarcarNoLeido={() => { setDetalleVisible(false); Alert.alert('No leído', 'Funcionalidad en desarrollo'); }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
  },
  navItemText: {
    fontSize: 10,
    color: theme.colors.primary.main,
    fontWeight: '500',
    textAlign: 'center',
  },
  navIconGif: {
    width: 36,
    height: 36,
    marginBottom: 4,
  },
  navIconGifActive: {
    width: 40,
    height: 40,
    marginBottom: 2,
  },
  // navItemText duplicado eliminado
  navItemTextActive: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: 2,
    elevation: 8,
  },
  firmaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 6,
  },
  avatarMargin: {
    marginRight: 8,
  },
  cardIconCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
    gap: 8,
  },
  touchIconLarge: {
    marginLeft: 0,
  },
  avisoCard: {
    backgroundColor: '#fff',
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
    borderRadius: 24,
    flex: 1,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avisoCardTitle: {
    color: theme.colors.text.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  avisoCardSubtitle: {
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  avisoCardInfoText: {
    color: theme.colors.text.secondary,
    fontSize: 12,
  },
  cardFooterButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
    flexDirection: 'row',
    gap: 8,
  },
  cardFooterText: {
    color: theme.colors.primary.main,
    fontWeight: '700',
    fontSize: 15,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
  },
  contentArea: {
    flex: 1,
  },
  firmasListContent: {
    paddingBottom: 24,
  },
  sectionSubtitle: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  mailCard: {
    backgroundColor: '#fff',
    borderColor: theme.colors.primary.main,
    borderWidth: 1.5,
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 6,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 1,
  },
  mailActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 4,
  },
  mailActionIcon: {
    marginRight: 8,
    padding: 4,
    borderRadius: 6,
  },
  mailPriority: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  mailPriorityText: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  mailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
    gap: 8,
  },
  mailSenderText: {
    fontSize: 13,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  mailJobText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '400',
  },
  mailDateText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '400',
    textAlign: 'right',
    minWidth: 120,
  },
  mailSubjectRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mailSubjectText: {
    fontSize: 15,
    color: theme.colors.text.primary,
    fontWeight: '500',
    lineHeight: 22,
  },
  flex1: {
    flex: 1,
  },
  rowAlignCenterFlex1: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalFullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 999,
  },
});

export default Avisos;
