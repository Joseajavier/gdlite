import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  TextInput,
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<NavigationProp<any>>();
  const { avisos } = useAvisos();

  const handleUserMenuToggle = () => setShowUserMenu((v) => !v);

  // Función para filtrar avisos basado en el texto de búsqueda
  const filteredAvisos = avisos?.filter((item: any) => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase();
    const searchFields = [
      item?.nombreUsuario,
      item?.puestoTrabajo,
      item?.puesto,
      item?.asunto,
      item?.comentario,
      item?.registro,
      item?.materia,
      item?.estado,
      item?.etiquetas,
      item?.interesado,
      item?.solicitante,
      item?.referencia2,
      item?.extracto,
      // Convertir prioridad a texto
      typeof item?.prioridad === 'number' && item.prioridad >= 0 && item.prioridad <= 4
        ? ['Muy Baja', 'Baja', 'Media', 'Alta', 'Muy Alta'][item.prioridad]
        : '',
    ];
    
    return searchFields.some(field => 
      field && field.toString().toLowerCase().includes(searchLower)
    );
  }) || [];

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

    const handleCardPress = () => {
      navigation.navigate('AvisoDetalle', {
        aviso: item,
        onReenviar: () => Alert.alert('Reenviar', 'En desarrollo'),
        onResponder: () => Alert.alert('Responder', 'En desarrollo'),
        onMarcarNoLeido: () => Alert.alert('No leído', 'En desarrollo'),
      });
    };

    return (
      <Swipeable
        renderRightActions={(prog, dragX) => renderRightActions(prog, dragX, item)}
        overshootRight={false}
        rightThreshold={BUTTON_WIDTH}
      >
        <TouchableOpacity style={styles.swipeContainer} onPress={handleCardPress} activeOpacity={0.7}>
          <View style={styles.mailCard}>
            {/* Icono de deslizamiento en la esquina superior derecha */}
            <View style={styles.swipeHintIconContainer}>
              <MaterialIcons name="swipe" size={20} color="#bbb" /> {/* Reducido de 22 a 20 */}
            </View>
            <View style={styles.mailHeaderRow}>
              <View style={styles.rowAlignCenterFlex1}>
                <Avatar src={item?.ImgUsuario} alt={item?.nombreUsuario} size={40} style={styles.avatarMargin} /> {/* Reducido de 44 a 40 */}
                <View style={styles.flex1}>
                  <Typography style={styles.mailSenderText} numberOfLines={1} ellipsizeMode="tail">
                    Aviso enviado por: {item?.nombreUsuario || 'Sin usuario'}
                  </Typography>
                  <Typography style={styles.mailJobText} numberOfLines={1} ellipsizeMode="tail">
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
                {item?.comentario || item?.asunto || 'Sin comentario'}
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
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <>
      <MainLayout
        title="Despacho de Asuntos"
        onUserMenuToggle={handleUserMenuToggle}
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
          {/* Buscador */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar en avisos..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
                  <MaterialIcons name="clear" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {filteredAvisos?.length ? (
            <FlatList
              data={filteredAvisos}
              keyExtractor={(it, ix) => it.id?.toString() || ix.toString()}
              renderItem={renderAviso}
              contentContainerStyle={styles.list}
            />
          ) : (
            <Typography style={styles.noAvisos}>
              {searchText.trim() ? 'No se encontraron avisos que coincidan con la búsqueda' : 'No hay avisos disponibles'}
            </Typography>
          )}
        </View>

      {/* Overlay para cerrar menú de usuario con borde azul solo en Avisos */}
      {showUserMenu && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
          <TouchableOpacity style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} activeOpacity={1} onPress={() => setShowUserMenu(false)} />
          <View style={{ marginTop: 60, marginRight: 16, borderWidth: 2, borderColor: theme.colors.primary.main, borderRadius: 12, backgroundColor: '#fff', minWidth: 200, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, overflow: 'hidden' }}>
            {/* Aquí puedes poner el contenido del menú si lo deseas */}
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Typography style={{ color: theme.colors.primary.main, fontWeight: 'bold' }}>Menú de usuario</Typography>
            </View>
          </View>
        </View>
      )}
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
  swipeHintIconContainer: {
    position: 'absolute',
    top: 6, // Reducido de 8 a 6
    right: 8, // Reducido de 10 a 8
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 10, // Reducido de 12 a 10
    padding: 2,
  },
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
    paddingVertical: 10, // Reducido de 12 a 10
    backgroundColor: theme.colors.primary.main,
  },
  noAvisos: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 50,
  },
  swipeContainer: {
    width: '100%',
    height: 145, // Aumentado de 130 a 145 para dar más espacio al comentario
    paddingHorizontal: 10,
    marginBottom: 8,
    position: 'relative',
  },
  mailCard: {
    height: 145, // Aumentado de 130 a 145
    backgroundColor: '#fff',
    borderColor: theme.colors.primary.main,
    borderWidth: 1.5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionsContainer: {
    width: BUTTON_WIDTH * 3,
    flexDirection: 'row',
    height: 145, // Aumentado de 130 a 145
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
    paddingHorizontal: 10, // Reducido de 12 a 10
    paddingTop: 6, // Reducido de 8 a 6
    paddingBottom: 2,
    gap: 6, // Reducido de 8 a 6
  },
  rowAlignCenterFlex1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMargin: { marginRight: 6 }, // Reducido de 8 a 6
  mailSenderText: {
    fontSize: 12, // Reducido de 13 a 12
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  mailJobText: {
    fontSize: 11, // Reducido de 12 a 11
    color: theme.colors.text.secondary,
    fontWeight: '400',
  },
  mailSubjectRow: {
    paddingHorizontal: 12,
    paddingVertical: 8, // Aumentado de 6 a 8 para dar más espacio al comentario
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flex: 1, // Añadido flex para que use el espacio disponible
    minHeight: 36, // Añadido minHeight para asegurar espacio suficiente
  },
  mailSubjectText: {
    fontSize: 13, // Mantenido en 13
    color: theme.colors.text.primary,
    fontWeight: '500',
    lineHeight: 18, // Mantenido en 18
  },
  mailActionsRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 4, // Reducido para ajustar mejor
    paddingBottom: 6,
    gap: 4,
  },
  mailPrioridadText: {
    fontSize: 10, // Reducido de 12 a 10
    color: '#222',
    fontWeight: '700',
    backgroundColor: '#e0e0e0',
    borderRadius: 6, // Reducido de 8 a 6
    paddingHorizontal: 6, // Reducido de 8 a 6
    paddingVertical: 1, // Reducido de 2 a 1
    marginRight: 6, // Reducido de 8 a 6
    minWidth: 60, // Reducido de 80 a 60
    textAlign: 'left',
  },
  mailDateText: {
    fontSize: 10, // Reducido de 12 a 10
    color: theme.colors.text.secondary,
    fontWeight: '400',
    textAlign: 'right',
    minWidth: 100, // Reducido de 120 a 100
  },
  extraInfoContainer: {
    marginTop: 4, // Reducido de 6 a 4 para optimizar espacio
    backgroundColor: '#f8f8fa',
    borderRadius: 10, // Mantenido en 10
    padding: 6, // Reducido de 8 a 6 para optimizar espacio
  },
  extraInfoTitle: {
    fontSize: 13, // Reducido de 14 a 13
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: 4, // Reducido de 6 a 4
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
  searchContainer: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default Avisos;
