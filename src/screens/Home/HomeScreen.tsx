import React, { useState, useEffect } from 'react';
import { useAvisos } from '../../context/AvisosContext';
import { usePendingSignatures } from '../../context/PendingSignaturesContext';
import { useSession } from '../../context/SessionContext';
import { StorageManager } from '../../utils/storage';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserMenuFull from '../../components/UserMenuFull';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import ConfigModal from '../../components/ConfigModal';
import { theme } from '../../styles/theme';



interface HomeScreenProps {
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
  onResetConfig?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout, onNavigate, onResetConfig: _onResetConfig }) => {
  const { token } = useSession();
  // Estado para el número de firmas pendientes
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const { setPendingSignatures } = usePendingSignatures();
  const { avisos, setAvisos } = useAvisos();
  const [loadingAvisos, setLoadingAvisos] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);

  // Llama al backend para obtener firmas pendientes y avisos usando POST
  useEffect(() => {
    const fetchData = async () => {
      setLoadingPending(true);
      setLoadingAvisos(true);
      try {
        if (!token) return;
        const config = await StorageManager.getAppConfig();
        if (!config || !(config as any).UrlSwagger) throw new Error('No se encontró la URL base en la configuración');
        let baseUrl = (config as any).UrlSwagger;
        if (!baseUrl.endsWith('/')) baseUrl += '/';
        const url = `${baseUrl}avisos/getAvisos`;

        // Firmas pendientes
        const bodyFirmas = {
          token,
          reader: "0",
          deleted: "0",
          document: "1"
        };
        const responseFirmas = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyFirmas)
        });
        let dataFirmas;
        try {
          dataFirmas = await responseFirmas.json();
        } catch (e) {
          dataFirmas = null;
        }
        if (!responseFirmas.ok) throw new Error('Error al obtener firmas pendientes');
        if (dataFirmas && Array.isArray(dataFirmas.avisos)) {
          setPendingCount(dataFirmas.avisos.length);
          setPendingSignatures(dataFirmas.avisos);
          console.log('FIRMAS:', JSON.stringify(dataFirmas.avisos, null, 2));
        } else {
          setPendingCount(0);
          setPendingSignatures([]);
        }

        // Avisos
        const bodyAvisos = {
          token,
          reader: "0",
          deleted: "0",
          document: "0"
        };
        const responseAvisos = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyAvisos)
        });
        let dataAvisos;
        try {
          dataAvisos = await responseAvisos.json();
        } catch (e) {
          dataAvisos = null;
        }
        if (!responseAvisos.ok) throw new Error('Error al obtener avisos');
        if (dataAvisos && Array.isArray(dataAvisos.avisos)) {
          setAvisos(dataAvisos.avisos);
        } else {
          setAvisos([]);
        }
      } catch (err) {
        setPendingCount(null);
        setPendingSignatures([]);
        setAvisos([]);
        console.error('Error fetching firmas/avisos:', err);
      } finally {
        setLoadingPending(false);
        setLoadingAvisos(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configData, setConfigData] = useState<any>(null);

  // Recarga la configuración cada vez que el modal se abre
  // Recarga la configuración cada vez que el modal se abre
  useEffect(() => {
    if (showConfigModal) {
      (async () => {
        try {
          const config = await StorageManager.getAppConfig();
          setConfigData(config);
        } catch (error) {
          console.error('[Config] Error al obtener configuración:', error);
          Alert.alert('Error', 'No se pudo obtener la configuración');
        }
      })();
    } else {
      setConfigData(null); // Limpia los datos al cerrar el modal
    }
  }, [showConfigModal]);

  const handleShowConfig = () => {
    setShowConfigModal(true);
  };
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Alterna el menú de usuario
  const handleUserMenuToggle = () => {
    setShowUserMenu((prev) => !prev);
  };
  
  const handlePortadirmas = () => {
    // Al navegar a portafirmas
    onNavigate?.('portafirmas');
  };

  const handleAvisos = () => {
    onNavigate?.('avisos');
  };

  const handleCalendario = () => {
    onNavigate?.('calendario');
  };

  const handleIA = () => {
    onNavigate?.('ia');
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
      {/* Modal legible de configuración (reutilizable) */}
      <ConfigModal
        visible={showConfigModal}
        configData={configData}
        onClose={() => setShowConfigModal(false)}
      />
      {/* User Menu Dropdown y fondo para cerrar (componente reutilizable) */}
      <UserMenuFull
        visible={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        onOption={handleMenuOption}
        styles={styles}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.cardTouchable} onPress={handlePortadirmas} activeOpacity={0.9}>
            <DashboardCard
              title="Portafirmas"
              subtitle="Accede a tus documentos para firmar"
              gifSource={require('../../assets/images/firma-unscreen.gif')}
              infoIcon="pending-actions"
              infoText={
                loadingPending
                  ? 'Firmas pendientes: ...'
                  : pendingCount === null
                    ? 'Firmas pendientes: ?'
                    : `Firmas pendientes: ${pendingCount}`
              }
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardTouchable} onPress={handleAvisos} activeOpacity={0.9}>
            <DashboardCard
              title="Avisos"
              subtitle="Consulta tus notificaciones importantes"
              gifSource={require('../../assets/images/notificacion-unscreen.gif')}
              infoIcon="notification-important"
              infoText={
                loadingAvisos
                  ? 'Nuevos avisos: ...'
                  : avisos && Array.isArray(avisos)
                    ? `Nuevos avisos: ${avisos.length}`
                    : 'Nuevos avisos: ?'
              }
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
    padding: 12, // Reducido de 16 a 12
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
    gap: 6, // Reducido de 8 a 6
    paddingVertical: 2, // Reducido de 4 a 2
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
