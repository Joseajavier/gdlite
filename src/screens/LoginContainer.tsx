import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Login from './Login';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLoginSuccess = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { config: {} as any } }],
    });
  };

  return (
    <Login onLoginSuccess={handleLoginSuccess} />
  );
};

export default LoginContainer;
