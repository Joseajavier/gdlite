import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import { Typography } from '../../components/Typography';
import { theme } from '../../styles/theme';


interface HomeScreenProps {
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
  onResetConfig?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout, onNavigate, onResetConfig: _onResetConfig }) => {
  const handleShowConfig = async () => {
    try {
      const { keychainService } = await import('../../services/keychainService');
      const config = await keychainService.getAppConfig();
      console.log('[Config] Datos guardados:', config);
      Alert.alert(
        'Configuración guardada',
        config ? JSON.stringify(config, null, 2) : 'No hay configuración guardada'
      );
    } catch (error) {
      console.error('[Config] Error al obtener configuración:', error);
      Alert.alert('Error', 'No se pudo obtener la configuración');
    }
  };
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Alterna el menú de usuario
  const handleUserMenuToggle = () => {
    setShowUserMenu((prev) => !prev);
  };
  
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
    // Implementación pendiente
    onLogout?.();
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
      <Navbar onUserMenuToggle={handleUserMenuToggle} />
      {/* User Menu Dropdown y fondo para cerrar */}
      {showUserMenu && (
        <>
          <TouchableOpacity
            style={styles.overlayAbsolute}
            activeOpacity={1}
            onPress={() => setShowUserMenu(false)}
          />
          <View style={styles.userMenuContainer}>
            <View style={styles.userMenu}>
              <View style={styles.userMenuHeader}>
                <MaterialIcons name="person" size={22} color="#666CFF" style={styles.menuIcon} />
                <Typography style={styles.menuText}>Usuario</Typography>
              </View>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('profile')}>
                <MaterialIcons name="person" size={20} color="#666CFF" style={styles.menuIcon} />
                <Typography style={styles.menuText}>Mi Perfil</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('settings')}>
                <MaterialIcons name="settings" size={20} color="#666CFF" style={styles.menuIcon} />
                <Typography style={styles.menuText}>Configuración</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('showConfig')}>
                <MaterialIcons name="info" size={20} color="#666CFF" style={styles.menuIcon} />
                <Typography style={styles.menuText}>Ver configuración</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('resetConfig')}>
                <MaterialIcons name="delete" size={20} color="#666CFF" style={styles.menuIcon} />
                <Typography style={styles.menuText}>Borrar configuración</Typography>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('logout')}>
                <MaterialIcons name="logout" size={20} color="#666CFF" style={styles.menuIcon} />
                <Typography style={styles.menuText}>Cerrar Sesión</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.cardTouchable} onPress={handlePortadirmas} activeOpacity={0.9}>
            <DashboardCard
              title="Portafirmas"
              subtitle="Accede a tus documentos para firmar"
              gifSource={require('../../assets/images/firma-unscreen.gif')}
              infoIcon="pending-actions"
              infoText="Firmas pendientes: 5"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardTouchable} onPress={handleAvisos} activeOpacity={0.9}>
            <DashboardCard
              title="Avisos"
              subtitle="Consulta tus notificaciones importantes"
              gifSource={require('../../assets/images/notificacion-unscreen.gif')}
              infoIcon="notification-important"
              infoText="Nuevos avisos: 3"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardTouchable} onPress={handleCalendario} activeOpacity={0.9}>
            <DashboardCard
              title="Calendario"
              subtitle="Revisa tus eventos y citas"
              gifSource={require('../../assets/images/calendar.gif')}
              infoIcon="today"
              infoText="Eventos hoy: 2"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardTouchable} onPress={handleIA} activeOpacity={0.9}>
            <DashboardCard
              title="IA"
              subtitle="Asistente inteligente disponible"
              gifSource={require('../../assets/images/inteligencia-artificial.gif')}
              infoIcon="support-agent"
              infoText="Asistente disponible"
            />
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
  gradientNavbar: {
    backgroundColor: 'linear-gradient(90deg, #666CFF 0%, #5F5FFF 100%)',
    paddingBottom: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    gap: 8,
    paddingVertical: 4,
  },
  cardTouchable: {
    flex: 1,
    marginBottom: 0,
  },
  modernCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 130,
    padding: 14,
    borderRadius: 24,
    backgroundColor: '#666CFF',
    shadowColor: '#5F5FFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
    marginVertical: 5,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  cardIconSection: {
    // El fondo redondo se elimina para el GIF, pero se mantiene para los otros iconos
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255,255,255,0.18)',
    // borderRadius: 28,
    marginRight: 14,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  cardContentSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  cardInfoIcon: {
    marginRight: 6,
  },
  cardInfoText: {
    color: '#E6E9FF',
    fontSize: 13,
    fontWeight: '500',
  },
  cardIcon: {
    marginBottom: 0,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 18,
    letterSpacing: 1.2,
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
    top: 70,
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
  overlayAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'transparent',
  },
// Estilos de iconos eliminados
});

export default HomeScreen;
