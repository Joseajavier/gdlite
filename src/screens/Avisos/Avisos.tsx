import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Typography } from '../../components/Typography';
import { theme } from '../../styles/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Avisos: React.FC = () => {
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
        navigation.navigate('Portafirmas');
        break;
      case 'avisos':
        // Ya estamos en avisos, no hacer nada
        break;
      case 'calendario':
        navigation.navigate('Calendario');
        break;
      default:
        Alert.alert('Navegación', `Funcionalidad de ${screen} en desarrollo`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.main} />
      
      <View style={styles.content}>
        {/* Navbar Content - Adaptado de GdAdmin */}
        <View style={styles.navbarContent}>
          {/* Left Section */}
          <View style={styles.navbarLeftSection}>
            <TouchableOpacity style={styles.navToggle}>
              <Typography variant="h4" style={styles.navIcon}>☰</Typography>
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Typography variant="h6" style={styles.logoText}>Avisos</Typography>
            </View>
          </View>

          {/* Right Section */}
          <View style={styles.navbarRightSection}>
            <TouchableOpacity onPress={handleUserMenuToggle} style={styles.navbarUserAction}>
              <Typography variant="h6" style={styles.navIcon}>👤</Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Menu Dropdown */}
        {showUserMenu && (
          <View style={styles.userMenuContainer}>
            <View style={styles.userMenu}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuOption('profile')}
              >
                <Typography style={styles.menuIcon}>👤</Typography>
                <Typography style={styles.menuText}>Mi Perfil</Typography>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuOption('settings')}
              >
                <Typography style={styles.menuIcon}>⚙️</Typography>
                <Typography style={styles.menuText}>Configuración</Typography>
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuOption('logout')}
              >
                <Typography style={styles.menuIcon}>🚪</Typography>
                <Typography style={styles.menuText}>Cerrar Sesión</Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Overlay for closing menu */}
        {showUserMenu && (
          <Modal
            transparent={true}
            visible={showUserMenu}
            onRequestClose={() => setShowUserMenu(false)}
          >
            <TouchableOpacity 
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setShowUserMenu(false)}
            />
          </Modal>
        )}

        {/* Main Content Area */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentArea}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Notificaciones y Avisos
            </Typography>
            <Typography variant="body1" style={styles.sectionSubtitle}>
              Aquí irán las cards y contenido de avisos importantes
            </Typography>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => handleBottomNavigation('home')}
          >
            <Typography style={styles.navItemIcon}>🏠</Typography>
            <Typography style={styles.navItemText}>Inicio</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => handleBottomNavigation('portafirmas')}
          >
            <Typography style={styles.navItemIcon}>🖊️</Typography>
            <Typography style={styles.navItemText}>Portafirmas</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, styles.navItemActive]}
            onPress={() => handleBottomNavigation('avisos')}
          >
            <Typography style={styles.navItemIconActive}>📢</Typography>
            <Typography style={styles.navItemTextActive}>Avisos</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => handleBottomNavigation('calendario')}
          >
            <Typography style={styles.navItemIcon}>📅</Typography>
            <Typography style={styles.navItemText}>Calendario</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => handleBottomNavigation('ia')}
          >
            <Typography style={styles.navItemIcon}>🤖</Typography>
            <Typography style={styles.navItemText}>IA</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  // User Menu Dropdown styles
  userMenuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1000,
  },
  userMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuIcon: {
    fontSize: 16,
    color: '#666CFF',
  },
  menuText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
    marginHorizontal: 16,
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
  navItemIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#999999',
  },
  navIconGif: {
    width: 20,
    height: 20,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  webviewIconContainer: {
    width: 20,
    height: 20,
    marginBottom: 4,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  navItemIconActive: {
    fontSize: 20,
    marginBottom: 4,
    color: '#FFFFFF',
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

export default Avisos;
