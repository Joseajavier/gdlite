import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import QRScanner from './QRScanner';
import MainLayout from '../../components/MainLayout';
import { AppConfigData } from '../../services/keychainService';

const QRScannerContainer: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleScanSuccess = (code: string) => {
    let config: AppConfigData | null = null;
    try {
      config = JSON.parse(code);
    } catch (e) {
      return;
    }
    if (config) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login', params: { config } }],
      });
    }
  };

  return (
    <MainLayout>
      <QRScanner onScanSuccess={handleScanSuccess} />
    </MainLayout>
  );
};

export default QRScannerContainer;
