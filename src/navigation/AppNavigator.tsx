import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartupScreenContainer from '../screens/StartupScreenContainer';
import LoginContainer from '../screens/Login/LoginContainer';
import HomeScreenContainer from '../screens/Home/HomeScreenContainer';
import QRScannerContainer from '../screens/QRscanner/QRScannerContainer';
import Portafirmas from '../screens/PortaFirmas/Portafirmas';
import DetalleFirma from '../screens/PortaFirmas/DetalleFirma';
import Avisos from '../screens/Avisos/Avisos';
import Calendario from '../screens/Calendar/Calendario';
import AvisoDetalle from '../screens/Avisos/AvisoDetalle';
import IA from '../screens/IA/IA';

export type RootStackParamList = {
  Startup: undefined;
  Login: undefined;
  Home: undefined;
  QRScanner: undefined;
  Portafirmas: undefined;
  Avisos: undefined;
  Calendario: undefined;
  AvisoDetalle: { aviso: any };
  DetalleFirma: { documento: string };
  IA: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="QRScanner" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Startup" component={StartupScreenContainer} />
    <Stack.Screen name="Login" component={LoginContainer} />
    <Stack.Screen name="Home" component={HomeScreenContainer} />
    <Stack.Screen name="QRScanner" component={QRScannerContainer} />
    <Stack.Screen name="Portafirmas" component={Portafirmas} />
    <Stack.Screen name="Avisos" component={Avisos} />
    <Stack.Screen name="Calendario" component={Calendario} />
    <Stack.Screen name="AvisoDetalle" component={AvisoDetalle} />
    <Stack.Screen name="DetalleFirma" component={DetalleFirma} />
    <Stack.Screen name="IA" component={IA} />
  </Stack.Navigator>
);

export default AppNavigator;
