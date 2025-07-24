import React from 'react';
import ConfigModal from './ConfigModal';
import { View, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Typography } from './Typography';

interface UserMenuFullProps {
  visible: boolean;
  onClose: () => void;
  onOption: (option: string) => void;
  styles: any;
}

const UserMenuFull: React.FC<UserMenuFullProps> = ({ visible, onClose, onOption, styles }) => {
  const [showConfigModal, setShowConfigModal] = React.useState(false);
  const [configData, setConfigData] = React.useState<any>(null);

  // Recarga la configuración cada vez que el modal se abre
  React.useEffect(() => {
    if (showConfigModal) {
      (async () => {
        try {
          const { StorageManager } = await import('../utils/storage');
          const config = await StorageManager.getAppConfig();
          setConfigData(config);
        } catch (error) {
          console.error('[UserMenu] Error al obtener configuración:', error);
        }
      })();
    } else {
      setConfigData(null);
    }
  }, [showConfigModal]);

  if (!visible) return null;
  return (
    <>
      <TouchableOpacity
        style={styles.overlayAbsolute}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.userMenuContainer}>
        <View style={styles.userMenu}>
          <View style={styles.userMenuHeader}>
            <MaterialIcons name="person" size={22} color="#666CFF" style={styles.menuIcon} />
            <Typography style={styles.menuText}>Usuario</Typography>
          </View>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowConfigModal(true)}>
            <MaterialIcons name="info" size={20} color="#666CFF" style={styles.menuIcon} />
            <Typography style={styles.menuText}>Ver configuración</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => onOption('resetConfig')}>
            <MaterialIcons name="delete" size={20} color="#666CFF" style={styles.menuIcon} />
            <Typography style={styles.menuText}>Borrar configuración</Typography>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem} onPress={() => onOption('logout')}>
            <MaterialIcons name="logout" size={20} color="#666CFF" style={styles.menuIcon} />
            <Typography style={styles.menuText}>Cerrar Sesión</Typography>
          </TouchableOpacity>
        </View>
      </View>
      {/* Modal legible de configuración (reutilizable) */}
      <ConfigModal
        visible={showConfigModal}
        configData={configData}
        onClose={() => setShowConfigModal(false)}
      />
    </>
  );
};

export default UserMenuFull;
