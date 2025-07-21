import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import QRScanner from './QRScanner';
import { AppConfigData } from '../../services/keychainService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const QRScannerContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleScanSuccess = (config: AppConfigData) => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login', params: { config } }],
    });
  };

  const handleScanCancel = () => {
    navigation.goBack();
  };

  return (
    <QRScanner
      onScanSuccess={handleScanSuccess}
      onScanCancel={handleScanCancel}
    />
  );
};

export default QRScannerContainer;
