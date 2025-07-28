
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
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
  const navigation = useNavigation<NavigationProp<any>>();

  const handleUserMenuToggle = () => setShowUserMenu((v) => !v);

  const handleMenuOption = (option: any) => {
    // Manejo de opciones del menú de usuario
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
      <TouchableOpacity style={styles.actionButtonResponder} onPress={() => Alert.alert('Firmar', `Firmar documento de: ${item?.nombreUsuario || 'Usuario'}`)}>
        <MaterialIcons name="edit" size={24} color="#fff" />
        <Typography style={styles.actionLabelWhite}>Firmar</Typography>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButtonNoLeido} onPress={() => Alert.alert('Rechazar', `Rechazar documento de: ${item?.nombreUsuario || 'Usuario'}`)}>
        <MaterialIcons name="close" size={24} color="#fff" />
        <Typography style={styles.actionLabelWhite}>Rechazar</Typography>
      </TouchableOpacity>
    </View>
  );

  const renderFirma = ({ item }: { item: any }) => {
    // Se eliminó la variable fechaCorta y el cálculo de fecha

    const comment = item?.comentario?.trim() ? item.comentario : 'Sin comentario';
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
                    Documento enviado por: {item?.nombreUsuario || 'Sin usuario'}
                  </Typography>
                  <Typography style={styles.mailJobText}>
                    {item?.puestoTrabajo || item?.puesto || 'Sin puesto'}
                  </Typography>
                </View>
              </View>
            </View>

            <View style={styles.mailSubjectRow}>
              <Typography style={styles.mailSubjectText}>{comment}</Typography>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
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
        <View style={styles.contentArea}>
          {pendingSignatures?.length ? (
            <FlatList
              data={pendingSignatures}
              keyExtractor={(it, ix) => it.Id?.toString() || it.id?.toString() || ix.toString()}
              renderItem={renderFirma}
              contentContainerStyle={styles.firmasListContent}
            />
          ) : (
            <Typography style={styles.noFirmasText}>No tienes firmas pendientes.</Typography>
          )}
        </View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1, backgroundColor: '#F8F8FA' },
  contentArea: { flex: 1, padding: 12 },
  firmasListContent: { paddingBottom: 24 },
  noFirmasText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 15,
    marginTop: 32,
  },
  flex1: { flex: 1 },
  avatarMargin: { marginRight: 8 },
  actionsContainer: {
    width: BUTTON_WIDTH * 3,
    flexDirection: 'row',
    height: 160,
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
    height: 160,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  mailCard: {
    height: 160,
    backgroundColor: '#fff',
    borderColor: theme.colors.primary.main,
    borderWidth: 1.5,
    borderRadius: 18,
    overflow: 'hidden',
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
});

export default Portafirmas;
