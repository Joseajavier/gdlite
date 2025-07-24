import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import UserMenuFull from '../../components/UserMenuFull';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Typography } from '../../components/Typography';
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

  return (
    <MainLayout onUserMenuToggle={handleUserMenuToggle} bottomNav={
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
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentArea}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Gestión de Portafirmas
            </Typography>
            <Typography variant="body1" style={styles.sectionSubtitle}>
              Aquí irán las cards y contenido del portafirmas
            </Typography>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
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
  navIcon: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // User Menu Dropdown styles (idéntico a HomeScreen)
  userMenuContainer: {
    position: 'absolute',
    top: 5,
    right: 16,
    zIndex: 1000,
  },
  userMenu: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    minWidth: 220,
    elevation: 12,
    shadowColor: '#666CFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  userMenuHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 12,
  },
  menuIcon: {
    marginRight: 8,
  },
  menuText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 6,
    marginHorizontal: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
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
