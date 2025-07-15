import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { theme } from '../styles/theme';

interface HomeScreenProps {
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
  onResetConfig?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout, onNavigate, onResetConfig: _onResetConfig }) => {
  const handleShowConfig = async () => {
    try {
      const { keychainService } = await import('../services/keychainService');
      const config = await keychainService.getAppConfig();
      // Aquí podrías mostrar la configuración en pantalla si lo deseas
      // Por ahora no se muestra nada
    } catch (error) {
      // Error silenciado
    }
  };
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handlePortadirmas = () => {
    onNavigate?.('portafirmas');
  };

  const handleAvisos = () => {
    onNavigate?.('avisos');
  };

  const handleCalendario = () => {
    onNavigate?.('calendario');
  };

  const handleIA = () => {
    // IA en desarrollo
  };

  const handleLogout = () => {
    onLogout?.();
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleMenuOption = (option: string) => {
    setShowUserMenu(false);
    switch (option) {
      case 'profile':
        // Perfil en desarrollo
        break;
      case 'settings':
        // Configuración en desarrollo
        break;
      case 'showConfig':
        handleShowConfig();
        break;
      case 'resetConfig':
        _onResetConfig?.();
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.main} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Navbar Content - Adaptado de GdAdmin */}
        <View style={styles.navbarContent}>
          {/* Left Section */}
          <View style={styles.navbarLeftSection}>
            <TouchableOpacity style={styles.navToggle}>
              <Typography variant="h4" style={styles.navIcon}>☰</Typography>
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Typography variant="h6" style={styles.logoText}>GdLite</Typography>
            </View>
          </View>
          {/* Right Section */}
          <View style={styles.navbarRightSection}>
            <TouchableOpacity onPress={handleUserMenuToggle} style={styles.navbarUserAction}>
              <Typography variant="h6" style={styles.navIcon}>👤</Typography>
            </TouchableOpacity>
          </View>
        </View>
        {/* User Menu Dropdown y fondo para cerrar */}
        {showUserMenu && (
          <>
            <TouchableOpacity
              style={[styles.overlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }]}
              activeOpacity={1}
              onPress={() => setShowUserMenu(false)}
            />
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
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => handleMenuOption('showConfig')}
                >
                  <Typography style={styles.menuIcon}>📄</Typography>
                  <Typography style={styles.menuText}>Ver configuración</Typography>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => handleMenuOption('resetConfig')}
                >
                  <Typography style={styles.menuIcon}>🗑️</Typography>
                  <Typography style={styles.menuText}>Borrar configuración</Typography>
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
          </>
        )}
        {/* Dashboard Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.cardTouchable}
            onPress={handlePortadirmas}
            activeOpacity={0.8}
          >
            <Card style={styles.dashboardCard}>
              <View style={styles.cardIconSection}>
                <Typography style={styles.cardInfoIcon}>🖊️</Typography>
              </View>
              <View style={styles.cardContentSection}>
                <Typography variant="h4" style={styles.cardTitle}>
                  Portafirmas
                </Typography>
                <View style={styles.cardInfoRow}>
                  <Typography variant="body2" style={styles.cardInfoIcon}>📝</Typography>
                  <Typography variant="body2" style={styles.cardInfoText}>
                    Firmas pendientes: 5
                  </Typography>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cardTouchable}
            onPress={handleAvisos}
            activeOpacity={0.8}
          >
            <Card style={styles.dashboardCard}>
              <View style={styles.cardIconSection}>
                <Typography variant="h1" style={styles.cardEmoji}>
                  📢
                </Typography>
              </View>
              <View style={styles.cardContentSection}>
                <Typography variant="h4" style={styles.cardTitle}>
                  Avisos
                </Typography>
                <View style={styles.cardInfoRow}>
                  <Typography variant="body2" style={styles.cardInfoIcon}>🔔</Typography>
                  <Typography variant="body2" style={styles.cardInfoText}>
                    Nuevos avisos: 3
                  </Typography>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cardTouchable}
            onPress={handleCalendario}
            activeOpacity={0.8}
          >
            <Card style={styles.dashboardCard}>
              <View style={styles.cardIconSection}>
                <Typography variant="h1" style={styles.cardEmoji}>
                  📅
                </Typography>
              </View>
              <View style={styles.cardContentSection}>
                <Typography variant="h4" style={styles.cardTitle}>
                  Calendario
                </Typography>
                <View style={styles.cardInfoRow}>
                  <Typography variant="body2" style={styles.cardInfoIcon}>⏰</Typography>
                  <Typography variant="body2" style={styles.cardInfoText}>
                    Eventos hoy: 2
                  </Typography>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cardTouchable}
            onPress={handleIA}
            activeOpacity={0.8}
          >
            <Card style={styles.dashboardCard}>
              <View style={styles.cardIconSection}>
                <Typography variant="h1" style={styles.cardEmoji}>
                  🤖
                </Typography>
              </View>
              <View style={styles.cardContentSection}>
                <Typography variant="h4" style={styles.cardTitle}>
                  IA
                </Typography>
                <View style={styles.cardInfoRow}>
                  <Typography variant="body2" style={styles.cardInfoIcon}>💬</Typography>
                  <Typography variant="body2" style={styles.cardInfoText}>
                    Asistente disponible
                  </Typography>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
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
  cardsContainer: {
    flex: 1,
    gap: 6,
    paddingVertical: 2,
  },
  cardTouchable: {
    flex: 1,
  },
  dashboardCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    minHeight: 80,
    elevation: 4,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#666CFF',
    borderRadius: 12,
    marginVertical: 4,
  },
  cardIconSection: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    marginRight: 16,
  },
  cardContentSection: {
    flex: 1,
    justifyContent: 'center',
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardInfoIcon: {
    fontSize: 14,
    marginRight: 6,
    color: '#E6E9FF',
  },
  cardInfoText: {
    color: '#E6E9FF',
    fontSize: 12,
    fontWeight: '500',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  cardGifIcon: {
    width: 40,
    height: 40,
    tintColor: '#FFFFFF',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 2,
    fontSize: 16,
  },
  // NavbarContent styles - Adaptado de GdAdmin
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#666CFF',
    marginBottom: 12,
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
  navbarAction: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    minWidth: 36,
    minHeight: 36,
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
  // User Menu Dropdown styles - Adaptado de GdAdmin UserDropdown
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
});

export default HomeScreen;
