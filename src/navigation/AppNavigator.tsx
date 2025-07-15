import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartupScreenContainer from '../screens/StartupScreenContainer';
import LoginContainer from '../screens/LoginContainer';
import HomeScreenContainer from '../screens/HomeScreenContainer';
import QRScannerContainer from '../screens/QRScannerContainer';
import Portafirmas from '../screens/Portafirmas';
import Avisos from '../screens/Avisos';
import Calendario from '../screens/Calendario';

export type RootStackParamList = {
  Startup: undefined;
  Login: undefined;
  Home: undefined;
  QRScanner: undefined;
  Portafirmas: undefined;
  Avisos: undefined;
  Calendario: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
 <NavigationContainer>
  <Stack.Navigator initialRouteName="QRScanner" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Startup" component={StartupScreenContainer} />
    <Stack.Screen name="Login" component={LoginContainer} />
    <Stack.Screen name="Home" component={HomeScreenContainer} />
    <Stack.Screen name="QRScanner" component={QRScannerContainer} />
    <Stack.Screen name="Portafirmas" component={Portafirmas} />
    <Stack.Screen name="Avisos" component={Avisos} />
    <Stack.Screen name="Calendario" component={Calendario} />
  </Stack.Navigator>
</NavigationContainer>

);

export default AppNavigator;
