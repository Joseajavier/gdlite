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
// Eliminado DashboardCard, usaremos layout personalizado tipo correo
import { Avatar } from '../../components/Avatar';
import { Typography } from '../../components/Typography';
import AvisoDetalle from './AvisoDetalle';
import { theme } from '../../styles/theme';

const BUTTON_WIDTH = 80; // ancho de cada botón
const CARD_RADIUS = 12; // mismo borderRadius que la card

const Avisos: React.FC = () => {
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [avisoActual, setAvisoActual] = useState<any>(null);
  const navigation = useNavigation<NavigationProp<any>>();
  const { avisos } = useAvisos();

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    _dragX: Animated.AnimatedInterpolation,
    item: any
  ) => {
    const trans = (i: number) =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [BUTTON_WIDTH * (i + 1), 0],
      });

    const actions = [
      {
        icon: 'info',
        label: 'Detalle',
        color: '#3A3A3C',
        onPress: () => {
          setAvisoActual(item);
          setDetalleVisible(true);
        },
        rounded: ['top', 'bottom'],
      },
      {
        icon: 'reply',
        label: 'Responder',
        color: '#FF9F0A',
        onPress: () => {
          setDetalleVisible(false);
          Alert.alert('Responder', 'Funcionalidad en desarrollo');
        },
      },
      {
        icon: 'forward',
        label: 'Reenviar',
        color: '#BF5AF2',
        onPress: () => {
          setDetalleVisible(false);
          Alert.alert('Reenviar', 'Funcionalidad en desarrollo');
        },
        rounded: ['top', 'bottom'],
      },
    ];

    return (
      <View style={styles.actionsContainer}>
        {actions.map((act, i) => {
          // aplicar borderRadius en extremos
          const radiusStyle: any = {};
          if (act.rounded?.includes('top')) {
            radiusStyle.borderTopRightRadius = CARD_RADIUS;
          }
          if (act.rounded?.includes('bottom')) {
            radiusStyle.borderBottomRightRadius = CARD_RADIUS;
          }
          return (
            <Animated.View
              key={i}
              style={[
                styles.actionButton,
                { backgroundColor: act.color },
                radiusStyle,
                { transform: [{ translateX: trans(i) }] },
              ]}
            >
              <TouchableOpacity style={StyleSheet.absoluteFill} onPress={act.onPress} />
              <MaterialIcons name={act.icon} size={24} color="#fff" />
              <Typography style={styles.actionLabel}>{act.label}</Typography>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  const renderAviso = ({ item }: { item: any }) => {
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
      <View style={styles.swipeContainer}>
        {/* Acciones fijas detrás del card */}
        <View style={styles.swipeActionsAbsolute}>
          {renderRightActions( new Animated.Value(1), new Animated.Value(0), item )}
        </View>
        <Swipeable
          renderRightActions={(prog, dragX) => renderRightActions(prog, dragX, item)}
          overshootRight={false}
          rightThreshold={BUTTON_WIDTH}
        >
          <View style={styles.mailCard}>
            <View style={styles.mailHeaderRow}>
              <View style={styles.rowAlignCenterFlex1}>
                <Avatar src={item?.ImgUsuario} size={44} style={styles.avatarMargin} />
                <View>
                  <Typography style={styles.mailSenderText}>
                    Aviso enviado por: {item?.nombreUsuario || 'Sin usuario'}
                  </Typography>
                <Typography style={styles.mailJobText}>
                  Puesto de Trabajo: {item?.puestoTrabajo || item?.puesto || 'Sin puesto'}
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
              {/* Prioridad a la izquierda, fecha a la derecha */}
              {typeof item?.prioridad === 'number' && item.prioridad >= 0 && item.prioridad <= 4 && (
                <Typography style={styles.mailPrioridadText}>
                  {['Muy Baja', 'Baja', 'Media', 'Alta', 'Muy Alta'][item.prioridad].padStart(2, '0 ')}
                </Typography>
              )}
              <View style={styles.flex1} />
              <Typography style={styles.mailDateText}>{fechaCorta || 'Sin fecha'}</Typography>
            </View>
            {/* Información relevante del objeto */}
            <View style={styles.extraInfoContainer}>
              <Typography style={styles.extraInfoTitle}>Información del Expediente</Typography>
              <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Registro:</Typography><Typography style={styles.extraInfoValue}>{item?.registro || '-'}</Typography></View>
              <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Materia:</Typography><Typography style={styles.extraInfoValue}>{item?.materia || '-'}</Typography></View>
              <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Estado:</Typography><Typography style={styles.extraInfoEstado}>{item?.estado || '-'}</Typography></View>
              <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Etiquetas:</Typography><Typography style={styles.extraInfoValue}>{item?.etiquetas || '-'}</Typography></View>
              <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Interesado:</Typography><Typography style={styles.extraInfoValue}>{item?.interesado || '-'}</Typography></View>
              <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Solicitante:</Typography><Typography style={styles.extraInfoValue}>{item?.solicitante || '-'}</Typography></View>
              <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Referencia:</Typography><Typography style={styles.extraInfoValue}>{item?.referencia2 || '-'}</Typography></View>
              <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Extracto:</Typography><Typography style={styles.extraInfoValue}>{item?.extracto || '-'}</Typography></View>
              {/* Otros campos relevantes */}
              {item?.id && <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>ID:</Typography><Typography style={styles.extraInfoValue}>{item.id}</Typography></View>}
              {item?.fecha && <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Fecha:</Typography><Typography style={styles.extraInfoValue}>{item.fecha}</Typography></View>}
              {item?.prioridad && <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Prioridad:</Typography><Typography style={styles.extraInfoValue}>{item.prioridad}</Typography></View>}
              {item?.tipo && <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Tipo:</Typography><Typography style={styles.extraInfoValue}>{item.tipo}</Typography></View>}
              {item?.comentario && <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Comentario:</Typography><Typography style={styles.extraInfoValue}>{item.comentario}</Typography></View>}
              {item?.usuarioDestino && <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Usuario Destino:</Typography><Typography style={styles.extraInfoValue}>{item.usuarioDestino}</Typography></View>}
              {item?.estadoLectura && <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Estado Lectura:</Typography><Typography style={styles.extraInfoValue}>{item.estadoLectura}</Typography></View>}
              {item?.notas && <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Notas:</Typography><Typography style={styles.extraInfoValue}>{item.notas}</Typography></View>}
            </View>
          </View>
        </Swipeable>
      </View>
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
              { name: 'Portafirmas', icon: require('../../assets/images/firma-unscreen.gif'), label: 'Portafirmas' },
              { name: 'Avisos', icon: require('../../assets/images/notificacion-unscreen.gif'), label: 'Avisos', active: true },
              { name: 'Calendario', icon: require('../../assets/images/calendar.gif'), label: 'Calendario' },
              { name: 'IA', icon: require('../../assets/images/inteligencia-artificial.gif'), label: 'IA' },
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

      {detalleVisible && (
        <View style={styles.modal}>
          <AvisoDetalle
            aviso={avisoActual}
            onClose={() => setDetalleVisible(false)}
            onReenviar={() => { setDetalleVisible(false); Alert.alert('Reenviar', 'En desarrollo'); }}
            onResponder={() => { setDetalleVisible(false); Alert.alert('Responder', 'En desarrollo'); }}
            onMarcarNoLeido={() => { setDetalleVisible(false); Alert.alert('No leído', 'En desarrollo'); }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
    overflow: 'hidden',
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
    overflow: 'hidden',
    marginLeft: 4,
  },
  swipeContainer: {
    width: '100%',
    marginBottom: 0,
  },
  swipeActionsAbsolute: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    height: '100%',
    zIndex: 0,
  },
  mailCard: {
    backgroundColor: '#fff',
    borderColor: theme.colors.primary.main,
    borderWidth: 1.5,
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 12,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 1,
    height: 160, // alto fijo para todos los cards
    overflow: 'hidden',
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
  rowAlignCenterFlex1: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarMargin: {
    marginRight: 8,
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
    // numberOfLines y ellipsizeMode van en el componente Typography
  },
  mailActionsRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
    gap: 4,
  },
  mailDateText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '400',
    textAlign: 'right',
    minWidth: 120,
  },
  flex1: {
    flex: 1,
  },

  cardContent: {
    flex: 1,
    width: '100%',
  },

  actionsContainer: {
    width: BUTTON_WIDTH * 3,
    flexDirection: 'row',
    height: '100%',                // para igualar altura de la card
  },
  actionButton: {
    width: BUTTON_WIDTH,
    height: 160, // alto fijo para botones compactos
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginTop: 10, // separación superior entre botones y cards
  },
  actionLabel: {
    color: '#FFF',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },

  avisoCard: {
    borderRadius: CARD_RADIUS,
    padding: 0,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    margin: 12,
  },
  avisoTitle: {
    color: theme.colors.primary.main,
    fontWeight: '700',
    fontSize: 16,
  },
  avisoSubtitle: {
    color: theme.colors.text.secondary,
    fontSize: 13,
  },
  avisoBody: {
    color: theme.colors.text.primary,
    fontSize: 15,
    paddingHorizontal: 12,
  },
  avisoInfo: {
    color: theme.colors.text.secondary,
    fontSize: 11,
  },

  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
  },
  list: {
    paddingVertical: 12,
  },
  noAvisos: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 50,
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

  modal: {
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
