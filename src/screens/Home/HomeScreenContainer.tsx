import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import HomeScreen from './HomeScreen';
import { keychainService } from '../../services/keychainService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreenContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    // Limpiar credenciales pero mantener configuración
    // Solo limpiamos las credenciales de usuario si las hay
    try {
      // Set a flag to prevent auto Face ID login after logout
      await keychainService.setJustLoggedOut(true);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleResetConfig = async () => {
    try {
      await keychainService.clearAppConfig();
      navigation.reset({
        index: 0,
        routes: [{ name: 'QRScanner' }],
      });
    } catch (error) {
      console.error('Error resetting configuration:', error);
    }
  };

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'portafirmas':
        navigation.navigate('Portafirmas');
        break;
      case 'avisos':
        navigation.navigate('Avisos');
        break;
      case 'calendario':
        navigation.navigate('Calendario');
        break;
      case 'ia':
        navigation.navigate('IA');
        break;
      case 'home':
        // Ya estamos en home, no hacer nada
        break;
      default:
        console.log(`Navigation to ${screen} not implemented yet`);
    }
  };

  return (
    <HomeScreen
      onLogout={handleLogout}
      onResetConfig={handleResetConfig}
      onNavigate={handleNavigate}
    />
  );
};

export default HomeScreenContainer;
