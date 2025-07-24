import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from './Avatar';
import { StorageManager } from '../utils/storage';
import { theme } from '../styles/theme';

interface NavbarProps {
  onUserMenuToggle?: () => void;
  rightContent?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ onUserMenuToggle, rightContent }) => {
  const [imgUsuario, setImgUsuario] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const config = await StorageManager.getAppConfig();
      setImgUsuario(config?.ImgUsuario || null);
    })();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.main} />
      <View style={styles.gradientNavbar}>
        <View style={styles.navbarContent}>
          {/* Puedes agregar aquí un logo o título si lo necesitas */}
          <View style={{ flex: 1 }} />
          <View style={styles.navbarRightSection}>
            {rightContent}
            {onUserMenuToggle && (
              <TouchableOpacity onPress={onUserMenuToggle} style={styles.navbarUserAction}>
                {imgUsuario ? (
                  <Avatar src={imgUsuario} size={36} variant="circular" />
                ) : (
                  <MaterialIcons name="account-circle" size={28} color="#fff" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gradientNavbar: {
    backgroundColor: 'linear-gradient(90deg, #666CFF 0%, #5F5FFF 100%)',
    paddingBottom: 2,
  },
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
  navbarRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
});

export default Navbar;
