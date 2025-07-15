import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import StartupScreen from './StartupScreen';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StartupScreenContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNeedQRConfig = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'QRScanner' }],
    });
  };

  const handleNeedBiometricAuth = () => {
    // La autenticación biométrica se maneja automáticamente en StartupScreen
    // Si falla, se redirige automáticamente al login
  };

  const handleNeedLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleAuthenticated = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { config: {} as any } }],
    });
  };

  return (
    <StartupScreen
      onNeedQRConfig={handleNeedQRConfig}
      onNeedBiometricAuth={handleNeedBiometricAuth}
      onNeedLogin={handleNeedLogin}
      onAuthenticated={handleAuthenticated}
    />
  );
};

export default StartupScreenContainer;
