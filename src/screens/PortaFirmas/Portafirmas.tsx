import React, { useState } from 'react';
import { FlatList, Text } from 'react-native';
import DashboardCard from '../../components/DashboardCard';
import { Avatar } from '../../components/Avatar';
import { usePendingSignatures } from '../../context/PendingSignaturesContext';
import { View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import UserMenuFull from '../../components/UserMenuFull';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Typography } from '../../components/Typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../styles/theme';
import MainLayout from '../../components/MainLayout';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Portafirmas: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive', 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

  const handleMenuOption = (option: string) => {
    setShowUserMenu(false);
    switch (option) {
      case 'profile':
        Alert.alert('Perfil', 'Funcionalidad en desarrollo');
        break;
      case 'settings':
        Alert.alert('Configuración', 'Funcionalidad en desarrollo');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  const handleBottomNavigation = (screen: string) => {
    switch (screen) {
      case 'home':
        navigation.goBack(); // Volver a la pantalla anterior (Home)
        break;
      case 'portafirmas':
        // Ya estamos en portafirmas, no hacer nada
        break;
      case 'avisos':
        navigation.navigate('Avisos');
        break;
      case 'calendario':
        navigation.navigate('Calendario');
        break;
      default:
        Alert.alert('Navegación', `Funcionalidad de ${screen} en desarrollo`);
    }
  };

  const { pendingSignatures } = usePendingSignatures();

  const renderFirmas = () => {
    if (!pendingSignatures || pendingSignatures.length === 0) {
      return (
        <Text style={styles.noFirmasText}>
          No tienes firmas pendientes.
        </Text>
      );
    }
    return (
      <FlatList
        data={pendingSignatures}
        keyExtractor={(item, idx) => item.Id?.toString() || item.id?.toString() || idx.toString()}
        renderItem={({ item }) => {
          console.log('Portafirmas item:', item);
          return (
            <View style={styles.firmaRow}>
              <DashboardCard
                title={item.nombreUsuario || 'Sin usuario'}
                subtitle={item.comentario || 'Sin comentario'}
                infoIcon="calendar-today"
                infoText={item.Fecha || item.fecha || 'Sin fecha'}
                left={
                  <Avatar
                    src={item.ImgUsuario}
                    size={54}
                    style={styles.avatarMargin}
                  />
                }
                footer={
                  <View style={styles.cardIconCenterRow}>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.idDocumento) {
                          navigation.navigate('DocumentoPDF', { idDocumento: item.idDocumento });
                        } else {
                          Alert.alert('Sin documento', 'No se encontró el idDocumento para este registro.');
                        }
                      }}
                    >
                      <MaterialIcons name="touch-app" size={44} color="#666CFF" style={styles.touchIconLarge} />
                    </TouchableOpacity>
                  </View>
                }
              />
            </View>
          );
        }}
        contentContainerStyle={styles.firmasListContent}
      />
    );
  };

  return (
    <MainLayout title="Portafirmas" onUserMenuToggle={handleUserMenuToggle} bottomNav={
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleBottomNavigation('home')}
        >
          <Image source={require('../../assets/images/home.gif')} style={styles.navIconGif} resizeMode="contain" />
          <Typography style={styles.navItemText}>Inicio</Typography>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => handleBottomNavigation('portafirmas')}
        >
          <Image source={require('../../assets/images/firma-unscreen.gif')} style={styles.navIconGifActive} resizeMode="contain" />
          <Typography style={styles.navItemTextActive}>Portafirmas</Typography>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleBottomNavigation('avisos')}
        >
          <Image source={require('../../assets/images/notificacion-unscreen.gif')} style={styles.navIconGif} resizeMode="contain" />
          <Typography style={styles.navItemText}>Avisos</Typography>
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
    }>
      {/* User Menu Dropdown (componente reutilizable) */}
      <UserMenuFull
        visible={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        onOption={option => handleMenuOption(option)}
        styles={styles}
      />
      <View style={styles.content}>
        {/* Main Content Area */}
        <View style={styles.contentArea}>
          {renderFirmas()}
        </View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  cardIconCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
    gap: 8,
  },
  pdfButtonLarge: {
    backgroundColor: '#F3F3FF',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  touchIconLarge: {
    marginLeft: 0,
  },
  pdfButtonRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 2,
  },
  pdfButtonSmall: {
    backgroundColor: '#F3F3FF',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchIconSmall: {
    marginLeft: 0,
  },
  pdfButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  noFirmasText: {
    textAlign: 'center',
    marginTop: 24,
    color: theme.colors.text.secondary,
  },
  firmaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 6,
  },
  avatarMargin: {
    marginRight: 14,
  },
  firmasListContent: {
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  contentArea: {
    flex: 1,
    // Elimina el centrado vertical y horizontal para que FlatList ocupe todo el ancho
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingVertical: 32,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  logoContainer: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoText: {
    color: theme.colors.common.white,
    fontWeight: '800',
    letterSpacing: 1,
  },
  // NavbarContent styles - Adaptado de GdAdmin
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#666CFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navbarLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navbarRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navToggle: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbarUserAction: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  pdfButton: {
    marginLeft: 12,
    backgroundColor: '#666CFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  pdfButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  touchIconCardContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  touchTextCard: {
    color: '#666CFF',
    fontSize: 10,
    fontWeight: '500',
    marginTop: -2,
  },
  // Bottom Navigation styles
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
    // No tintColor para mantener el color original del gif
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
