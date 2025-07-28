import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAvisos } from '../../context/AvisosContext';
import MainLayout from '../../components/MainLayout';
import { Avatar } from '../../components/Avatar';
import { Typography } from '../../components/Typography';
import ResponderModal from './ResponderModal';
import { theme } from '../../styles/theme';

const BUTTON_WIDTH = 80; // ancho de cada botón
// const CARD_RADIUS = 12; // mismo borderRadius que la card (unused)
const Avisos: React.FC = () => {
  const [avisoActual, setAvisoActual] = useState<any>(null);
  const [responderVisible, setResponderVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();
  const { avisos } = useAvisos();

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragX: Animated.AnimatedInterpolation<number>,
    item: any
  ) => {
    // const trans = (i: number) =>
    //   progress.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [BUTTON_WIDTH * (i + 1), 0],
    //   }); // unused

    const actions = [
      {
        icon: 'info',
        label: 'Detalle',
        color: '#3366FF',
        onPress: () => {
          navigation.navigate('AvisoDetalle', {
            aviso: item,
            onReenviar: () => Alert.alert('Reenviar', 'En desarrollo'),
            onResponder: () => Alert.alert('Responder', 'En desarrollo'),
            onMarcarNoLeido: () => Alert.alert('No leído', 'En desarrollo'),
          });
        },
      },
      {
        icon: 'reply',
        label: 'Responder',
        color: '#4CAF50',
        onPress: () => {
          setAvisoActual(item);
          setResponderVisible(true);
        },
      },
      {
        icon: 'mark-as-unread',
        label: 'Marcar como no leído',
        color: '#FF9800',
        onPress: () => {
          setAvisoActual(item);
          // Lógica para marcar como no leído
          Alert.alert('No leído', 'Funcionalidad en desarrollo');
        },
      },
    ];

    return (
      <Animated.View
        style={{
          ...styles.actionsContainer,
          transform: [
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [BUTTON_WIDTH * 3, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={styles.actionButtonDetalle}
          onPress={actions[0].onPress}
        >
          <MaterialIcons
            name={actions[0].icon}
            size={24}
            color={'#fff'}
            style={styles.actionIcon}
          />
          <Typography style={styles.actionLabelWhite}>
            {actions[0].label}
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButtonResponder}
          onPress={actions[1].onPress}
        >
          <MaterialIcons
            name={actions[1].icon}
            size={24}
            color={'#fff'}
            style={styles.actionIcon}
          />
          <Typography style={styles.actionLabelWhite}>
            {actions[1].label}
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButtonNoLeido}
          onPress={actions[2].onPress}
        >
          <MaterialIcons
            name={actions[2].icon}
            size={24}
            color={'#fff'}
            style={styles.actionIcon}
          />
          <Typography style={styles.actionLabelWhite}>
            {actions[2].label}
          </Typography>
        </TouchableOpacity>
      </Animated.View>
    );
  } // <-- close renderRightActions function

  const renderAviso = ({ item }: { item: any }) => {
    let fechaCorta = '';
    // Soporta tanto 'fecha' como 'Fecha' (mayúscula)
    const rawFecha = item?.fecha || item?.Fecha;
    if (rawFecha) {
      const pad = (n: number) => (n < 10 ? `0${n}` : n);
      const d = new Date(rawFecha);
      if (!isNaN(d.getTime())) {
        const yearShort = d.getFullYear().toString().slice(-2);
        fechaCorta = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${yearShort} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } else {
        fechaCorta = rawFecha;
      }
    } else {
      fechaCorta = '-';
    }

    return (
      <Swipeable
        renderRightActions={(prog, dragX) => renderRightActions(prog, dragX, item)}
        overshootRight={false}
        rightThreshold={BUTTON_WIDTH}
      >
        <View style={styles.swipeContainer}>
          <View style={styles.mailCard}>
            <View style={styles.mailHeaderRow}>
              <View style={styles.rowAlignCenterFlex1}>
                <Avatar src={item?.ImgUsuario} size={44} style={styles.avatarMargin} />
                <View style={styles.flex1}>
                  <Typography style={styles.mailSenderText}>
                    Aviso enviado por: {item?.nombreUsuario || 'Sin usuario'}
                  </Typography>
                  <Typography style={styles.mailJobText}>
                    {item?.puestoTrabajo || item?.puesto || 'Sin puesto'}
                  </Typography>
                </View>
              </View>
            </View>

            <View style={styles.mailSubjectRow}>
              <Typography
                style={styles.mailSubjectText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item?.asunto || item?.comentario || 'Sin asunto'}
              </Typography>
            </View>

            <View style={styles.mailActionsRowNoBorder}>
              {typeof item?.prioridad === 'number' &&
                item.prioridad >= 0 &&
                item.prioridad <= 4 && (
                  <Typography style={styles.mailPrioridadText}>
                    {['Muy Baja', 'Baja', 'Media', 'Alta', 'Muy Alta'][item.prioridad]}
                  </Typography>
                )}
              <View style={styles.flex1} />
              <Typography style={styles.mailDateText}>{fechaCorta || 'Sin fecha'}</Typography>
            </View>

            <View style={styles.extraInfoContainer}>
              <Typography style={styles.extraInfoTitle}>Información del Expediente</Typography>
              <View style={styles.extraInfoRow}>
                <Typography style={styles.extraInfoLabel}>Registro:</Typography>
                <Typography style={styles.extraInfoValue}>
                  {item?.registro || '-'}
                </Typography>
              </View>
              <View style={styles.extraInfoRow}>
                <Typography style={styles.extraInfoLabel}>Materia:</Typography>
                <Typography style={styles.extraInfoValue}>
                  {item?.materia || '-'}
                </Typography>
              </View>
              <View style={styles.extraInfoRow}>
                <Typography style={styles.extraInfoLabel}>Estado:</Typography>
                <Typography style={styles.extraInfoEstado}>
                  {item?.estado || '-'}
                </Typography>
              </View>
              <View style={styles.extraInfoRow}>
                <Typography style={styles.extraInfoLabel}>Etiquetas:</Typography>
                <Typography style={styles.extraInfoValue}>
                  {item?.etiquetas || '-'}
                </Typography>
              </View>
              <View style={styles.extraInfoRow}>
                <Typography style={styles.extraInfoLabel}>Interesado:</Typography>
                <Typography style={styles.extraInfoValue}>
                  {item?.interesado || '-'}
                </Typography>
              </View>
              <View style={styles.extraInfoRow}>
                <Typography style={styles.extraInfoLabel}>Solicitante:</Typography>
                <Typography style={styles.extraInfoValue}>
                  {item?.solicitante || '-'}
                </Typography>
              </View>
              <View style={styles.extraInfoRow}>
                <Typography style={styles.extraInfoLabel}>Referencia:</Typography>
                <Typography style={styles.extraInfoValue}>
                  {item?.referencia2 || '-'}
                </Typography>
              </View>
              <View style={styles.extraInfoRow}>
                <Typography style={styles.extraInfoLabel}>Extracto:</Typography>
                <Typography style={styles.extraInfoValue}>
                  {item?.extracto || '-'}
                </Typography>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <>
      <MainLayout
        title="Despacho de Asuntos"
        bottomNav={
          <View style={styles.bottomNav}>
            {[
              { name: 'Home', icon: require('../../assets/images/home.gif'), label: 'Inicio' },
              {
                name: 'Portafirmas',
                icon: require('../../assets/images/firma-unscreen.gif'),
                label: 'Portafirmas',
              },
              {
                name: 'Avisos',
                icon: require('../../assets/images/notificacion-unscreen.gif'),
                label: 'Avisos',
                active: true,
              },
              {
                name: 'Calendario',
                icon: require('../../assets/images/calendar.gif'),
                label: 'Calendario',
              },
              {
                name: 'IA',
                icon: require('../../assets/images/inteligencia-artificial.gif'),
                label: 'IA',
              },
            ].map((tab, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.navItem, tab.active && styles.navItemActive]}
                onPress={() => navigation.navigate(tab.name)}
              >
                <Image
                  source={tab.icon}
                  style={tab.active ? styles.navIconActive : styles.navIcon}
                  resizeMode="contain"
                />
                <Typography style={tab.active ? styles.navTextActive : styles.navText}>
                  {tab.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        }
        navbarBgColor="#fff"
        navbarTextColor={theme.colors.primary.main}
      >
        <View style={styles.container}>
          {avisos?.length ? (
            <FlatList
              data={avisos}
              keyExtractor={(it, ix) => it.id?.toString() || ix.toString()}
              renderItem={renderAviso}
              contentContainerStyle={styles.list}
            />
          ) : (
            <Typography style={styles.noAvisos}>No hay avisos disponibles</Typography>
          )}
        </View>
      </MainLayout>

      {/* El modal de detalle ha sido reemplazado por navegación a la pantalla AvisoDetalle */}

      {responderVisible && avisoActual && (
        <ResponderModal
          visible={responderVisible}
          onClose={() => setResponderVisible(false)}
          onSend={(mensaje) => {
            setResponderVisible(false);
            // Aquí puedes agregar lógica para enviar el mensaje
            Alert.alert('Mensaje enviado', mensaje);
          }}
          para={avisoActual?.nombreUsuario || avisoActual?.para || 'Sin usuario'}
          de={avisoActual?.puestoTrabajo || avisoActual?.puesto || 'Sin puesto'}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  actionButtonDetalle: {
    width: BUTTON_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#3366FF',
  },
  actionButtonResponder: {
    width: BUTTON_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#4CAF50',
  },
  actionButtonNoLeido: {
    width: BUTTON_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FF9800',
  },
  actionLabelWhite: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemActive: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
  },
  navIcon: {
    width: 36,
    height: 36,
  },
  navIconActive: {
    width: 40,
    height: 40,
  },
  navText: {
    fontSize: 10,
    color: theme.colors.primary.main,
  },
  navTextActive: {
    fontSize: 10,
    color: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flexGrow: 1,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary.main,
  },
  noAvisos: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 50,
  },
  swipeContainer: {
    width: '100%',
    height: 160,
    paddingHorizontal: 12,
    marginBottom: 10,
    position: 'relative',
  },
  mailCard: {
    height: 160,
    backgroundColor: '#fff',
    borderColor: theme.colors.primary.main,
    borderWidth: 1.5,
    borderRadius: 18,
    overflow: 'hidden',
  },
  actionsContainer: {
    width: BUTTON_WIDTH * 3,
    flexDirection: 'row',
    height: 160,
  },
  actionButton: {
    width: BUTTON_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  actionLabel: {
    color: '#FFF',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  actionIcon: {
    marginBottom: 4,
  },
  mailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
    gap: 8,
  },
  rowAlignCenterFlex1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMargin: { marginRight: 8 },
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
  mailActionsRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
    gap: 4,
  },
  mailPrioridadText: {
    fontSize: 12,
    color: '#222',
    fontWeight: '700',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 80,
    textAlign: 'left',
  },
  mailDateText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '400',
    textAlign: 'right',
    minWidth: 120,
  },
  extraInfoContainer: {
    marginTop: 8,
    backgroundColor: '#f8f8fa',
    borderRadius: 12,
    padding: 10,
  },
  extraInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: 6,
  },
  extraInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  extraInfoLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    minWidth: 90,
  },
  extraInfoValue: {
    fontSize: 12,
    color: theme.colors.text.primary,
    fontWeight: '400',
    flex: 1,
  },
  extraInfoEstado: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#ffe600',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontWeight: '700',
  },
  modal: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    backgroundColor: '#fff',
    borderRadius: 18,
    zIndex: 999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
});

export default Avisos;
