import React from 'react';
import ConfigModal from './ConfigModal';
import UserInfoModal from './UserInfoModal';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
  const [showUserInfoModal, setShowUserInfoModal] = React.useState(false);
  const [configData, setConfigData] = React.useState<any>(null);

  // Recarga la configuración cada vez que el menú se hace visible o el modal se abre
  React.useEffect(() => {
    if (visible || showConfigModal) {
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
  }, [visible, showConfigModal]);


const localStyles = StyleSheet.create({
  userMenuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMenuHeaderTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  menuTextFullName: {
    fontWeight: 'bold' as const,
    fontSize: 16,
  },
  menuTextUsername: {
    color: '#888',
    fontSize: 13,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#666CFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8, // separa el avatar del borde izquierdo
    marginRight: 16, // separa el avatar del texto
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});

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
          <View style={localStyles.userMenuHeaderRow}>
            {configData?.ImgUsuario ? (
              <View style={localStyles.avatarContainer}>
                <Image
                  source={{ uri: configData.ImgUsuario }}
                  style={localStyles.avatarImage}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <MaterialIcons name="person" size={36} color="#666CFF" style={styles.menuIcon} />
            )}
            <View style={localStyles.userMenuHeaderTextContainer}>
              <Typography style={localStyles.menuTextFullName}>
                {configData?.NombreCompleto || 'Usuario'}
              </Typography>
              <Typography style={localStyles.menuTextUsername}>
                {configData?.NombreUsuario ? `@${configData.NombreUsuario}` : ''}
              </Typography>
            </View>
          </View>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowConfigModal(true)}>
            <MaterialIcons name="info" size={20} color="#666CFF" style={styles.menuIcon} />
            <Typography style={styles.menuText}>Ver configuración</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowUserInfoModal(true)}>
            <MaterialIcons name="account-circle" size={20} color="#666CFF" style={styles.menuIcon} />
            <Typography style={styles.menuText}>Ver sesión actual</Typography>
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
      {/* Modal de información de sesión */}
      <UserInfoModal
        visible={showUserInfoModal}
        onClose={() => setShowUserInfoModal(false)}
      />
    </>
  );
};

export default UserMenuFull;
