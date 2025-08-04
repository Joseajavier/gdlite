
import React, { useState } from 'react';
import FirmarDocumentoModal from './FirmarDocumentoModal';
import RechazarFirmaModal from './RechazarFirmaModal';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { theme } from '../../styles/theme';
import { Avatar } from '../../components/Avatar';
import { Typography } from '../../components/Typography';
import { usePendingSignatures } from '../../context/PendingSignaturesContext';
import MainLayout from '../../components/MainLayout';
import UserMenuFull from '../../components/UserMenuFull';

const BUTTON_WIDTH = 80;



const Portafirmas = () => {
  const { pendingSignatures } = usePendingSignatures();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFirmarModal, setShowFirmarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [firmaActual, setFirmaActual] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<NavigationProp<any>>();

  const handleUserMenuToggle = () => setShowUserMenu((v) => !v);

  // Función para filtrar firmas basado en el texto de búsqueda
  const filteredSignatures = pendingSignatures?.filter((item: any) => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase();
    const searchFields = [
      item?.nombreUsuario,
      item?.puestoTrabajo,
      item?.puesto,
      item?.comentario,
      item?.documento,
      item?.asunto,
      // Convertir fecha a string si existe
      item?.fecha || item?.Fecha || item?.fechaCreacion,
    ];
    
    return searchFields.some(field => 
      field && field.toString().toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleMenuOption = (option: any) => {
    // Manejo de opciones del menú de usuario
  };

  const handleFirmar = (item: any) => {
    setFirmaActual(item);
    setShowFirmarModal(true);
  };
  const handleRechazar = (item: any) => {
    setFirmaActual(item);
    setShowRechazarModal(true);
  };

  const renderRightActions = (_: any, __: any, item: any) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={styles.actionButtonDetalle}
        onPress={() => navigation.navigate('DetalleFirma', {
          documento: item?.comentario || 'Sin documento',
          idDocumento: item?.idDocumento || item?.id || item?.Id
        })}
      >
        <MaterialIcons name="info" size={24} color="#fff" />
        <Typography style={styles.actionLabelWhite}>Detalle</Typography>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButtonResponder} onPress={() => handleFirmar(item)}>
        <MaterialIcons name="edit" size={24} color="#fff" />
        <Typography style={styles.actionLabelWhite}>Firmar</Typography>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButtonNoLeido} onPress={() => handleRechazar(item)}>
        <MaterialIcons name="close" size={24} color="#fff" />
        <Typography style={styles.actionLabelWhite}>Rechazar</Typography>
      </TouchableOpacity>
    </View>
  );

  const renderFirma = ({ item }: { item: any }) => {
    // Calcular fecha corta
    let fechaCorta = '';
    const rawFecha = item?.fecha || item?.Fecha || item?.fechaCreacion;
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

    const comment = item?.comentario?.trim() ? item.comentario : 'Sin comentario';
    
    const handleCardPress = () => {
      navigation.navigate('DetalleFirma', {
        documento: comment,
        idDocumento: item?.idDocumento || item?.id || item?.Id
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
                <Avatar src={item?.ImgUsuario} size={40} style={styles.avatarMargin} /> {/* Reducido de 44 a 40 */}
                <View style={styles.flex1}>
                  <Typography style={styles.mailSenderText} numberOfLines={1} ellipsizeMode="tail">
                    Documento enviado por: {item?.nombreUsuario || 'Sin usuario'}
                  </Typography>
                  <Typography style={styles.mailJobText} numberOfLines={1} ellipsizeMode="tail">
                    {item?.puestoTrabajo || item?.puesto || 'Sin puesto'}
                  </Typography>
                </View>
              </View>
            </View>

            <View style={styles.mailSubjectRow}>
              <Typography style={styles.mailSubjectText} numberOfLines={2} ellipsizeMode="tail">{comment}</Typography>
            </View>

            <View style={styles.mailActionsRowNoBorder}>
              <View style={styles.flex1} />
              <Typography style={styles.mailDateText}>{fechaCorta || 'Sin fecha'}</Typography>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <>
      <MainLayout
        title="Portafirmas"
        onUserMenuToggle={handleUserMenuToggle}
        bottomNav={
          <View style={styles.bottomNavigation}>
            {[
              { name: 'Home', icon: require('../../assets/images/home.gif'), label: 'Inicio' },
              { name: 'Portafirmas', icon: require('../../assets/images/firma-unscreen.gif'), label: 'Portafirmas', active: true },
              { name: 'Avisos', icon: require('../../assets/images/notificacion-unscreen.gif'), label: 'Avisos' },
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
                  style={tab.active ? styles.navIconGifActive : styles.navIconGif}
                  resizeMode="contain"
                />
                <Typography style={tab.active ? styles.navItemTextActive : styles.navItemText}>
                  {tab.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        }
      >
        <UserMenuFull
          visible={showUserMenu}
          onClose={() => setShowUserMenu(false)}
          onOption={handleMenuOption}
          styles={styles}
        />
        <View style={styles.content}>
          {/* Buscador */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar en portafirmas..."
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

          <View style={styles.contentArea}>
            {filteredSignatures?.length ? (
              <FlatList
                data={filteredSignatures}
                keyExtractor={(it, ix) => it.Id?.toString() || it.id?.toString() || ix.toString()}
                renderItem={renderFirma}
                contentContainerStyle={styles.firmasListContent}
              />
            ) : (
              <Typography style={styles.noFirmasText}>
                {searchText.trim() ? 'No se encontraron firmas que coincidan con la búsqueda' : 'No tienes firmas pendientes.'}
              </Typography>
            )}
          </View>
        </View>
      </MainLayout>
      {/* Modales de firmar y rechazar */}
      {showFirmarModal && (
        <FirmarDocumentoModal
          visible={showFirmarModal}
          onClose={() => setShowFirmarModal(false)}
          onFirmar={(cert, pass, motivo) => {
            setShowFirmarModal(false);
            // Aquí lógica de firmado real
            Alert.alert('Firmado', `Cert: ${cert}\nMotivo: ${motivo}`);
          }}
          certificados={['Mi Certificado']}
        />
      )}
      {showRechazarModal && (
        <RechazarFirmaModal
          visible={showRechazarModal}
          onClose={() => setShowRechazarModal(false)}
          onRechazar={(motivo) => {
            setShowRechazarModal(false);
            // Aquí lógica de rechazo real
            Alert.alert('Rechazado', motivo);
          }}
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
  content: { flex: 1, backgroundColor: '#F8F8FA' },
  contentArea: { flex: 1, padding: 10 }, // Reducido de 12 a 10
  firmasListContent: { paddingBottom: 20 }, // Reducido de 24 a 20
  noFirmasText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 15,
    marginTop: 32,
  },
  flex1: { flex: 1 },
  avatarMargin: { marginRight: 6 }, // Reducido de 8 a 6
  actionsContainer: {
    width: BUTTON_WIDTH * 3,
    flexDirection: 'row',
    height: 130, // Aumentado de 120 a 130
  },
  actionButtonDetalle: {
    width: BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#3366FF',
  },
  actionButtonResponder: {
    width: BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#4CAF50',
  },
  actionButtonNoLeido: {
    width: BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#E53935', // rojo fuerte
  },
  actionLabelWhite: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  swipeContainer: {
    width: '100%',
    height: 130, // Aumentado de 120 a 130 para dar más espacio
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  mailCard: {
    height: 130, // Aumentado de 120 a 130
    backgroundColor: '#fff',
    borderColor: theme.colors.primary.main,
    borderWidth: 1.5,
    borderRadius: 16,
    overflow: 'hidden',
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
    paddingVertical: 6, // Reducido de 8 a 6 para comprimir más
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flex: 1, // Añadido flex para que use el espacio disponible
  },
  mailSubjectText: {
    fontSize: 13, // Reducido de 14 a 13
    color: theme.colors.text.primary,
    fontWeight: '500',
    lineHeight: 18, // Reducido de 20 a 18
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
  },
  mailDateText: {
    fontSize: 10, // Reducido de 12 a 10
    color: theme.colors.text.secondary,
    fontWeight: '400',
    textAlign: 'right',
    minWidth: 100, // Reducido de 120 a 100
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
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#666CFF',
  },
  navIconGif: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },
  navIconGifActive: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },
  navItemText: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '500',
    textAlign: 'center',
  },
  navItemTextActive: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  searchContainer: {
    backgroundColor: '#F8F8FA',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary.main,
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

export default Portafirmas;
