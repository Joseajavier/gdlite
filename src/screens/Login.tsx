import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { Card } from '../components/Card';
import { theme } from '../styles/theme';
import { EyeIcon, EyeOffIcon } from '../components/icons';
import { keychainService } from '../services/keychainService';
import { authService } from '../services/authService';

const { height } = Dimensions.get('window');

// Tipos para el formulario
interface LoginFormData {
  user: string;
  password: string;
}

interface ErrorState {
  message: string[];
}

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  // Estados principales
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);
  // Al montar, comprobar si biometría está activada y disponible
  React.useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const enabled = await keychainService.getBiometricsEnabled();
        const canUse = await authService.canUseBiometrics();
        setBiometricsEnabled(!!enabled);
        setCanUseBiometrics(!!canUse);
      } catch (e) {
        setBiometricsEnabled(false);
        setCanUseBiometrics(false);
      }
    };
    checkBiometrics();
  }, []);
  
  // Estados del formulario
  const [formData, setFormData] = useState<LoginFormData>({
    user: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [errorState, setErrorState] = useState<ErrorState | null>(null);

  // Función para obtener la imagen diaria (como en GdAdmin)
  const getDailyBackgroundImage = (): string => {
    const date = new Date();
    let dia: string | number = date.getDate();
    
    if (dia < 10) {
      dia = '0' + dia;
    }
    
    return `https://sede.add4u.com/public/GestDoc/loginImages/img${dia}.jpg`;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.user.trim()) {
      newErrors.user = 'Este campo es obligatorio';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Este campo es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorState(null);

    try {
      // Simular llamada a la API de login
      console.log('Login attempt:', {
        user: formData.user,
        password: formData.password,
      });

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular respuesta exitosa
      if (formData.user === 'admin' && formData.password === 'admin') {
        // Guardar credenciales de usuario
        await keychainService.saveUserCredentials({
          username: formData.user,
          password: formData.password,
        });

        // Preguntar si desea activar biometría si no está ya activada
        if (!biometricsEnabled && canUseBiometrics) {
          Alert.alert(
            'Activar Biometría',
            '¿Deseas activar la autenticación biométrica para futuros accesos?',
            [
              { text: 'No', style: 'cancel' },
              { 
                text: 'Sí', 
                onPress: async () => {
                  await keychainService.setBiometricsEnabled(true);
                  setBiometricsEnabled(true);
                }
              }
            ]
          );
        }

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          Alert.alert('Éxito', 'Login exitoso', [
            { text: 'OK', onPress: () => console.log('Redirect to dashboard') }
          ]);
        }
      } else {
        setErrorState({
          message: ['Usuario o contraseña incorrectos']
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorState({
        message: ['Error de conexión. Inténtelo de nuevo.']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar errores al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (errorState) {
      setErrorState(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.main} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Fondo decorativo con imagen diaria */}
        <View style={styles.backgroundOverlay}>
          <Image
            source={{ uri: getDailyBackgroundImage() }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <View style={styles.backgroundMask} />
        </View>
        {/* Contenido principal */}
        <View style={styles.content}>
          <Card style={styles.loginCard}>
            {/* Logo y título */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <Typography variant="h1" style={styles.logoText}>
                  GdLite
                </Typography>
              </View>
            </View>
            {/* Formulario de login */}
            <View style={styles.loginSection}>
              {/* Campos del formulario */}
              <View style={styles.formContainer}>
                <TextField
                  value={formData.user}
                  onChangeText={(text) => handleInputChange('user', text)}
                  error={!!errors.user || !!errorState}
                  helperText={errors.user || (errorState ? errorState.message[0] : '')}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  placeholder="Usuario"
                />
                <View style={styles.passwordContainer}>
                  <TextField
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    secureTextEntry={!isPasswordVisible}
                    error={!!errors.password}
                    helperText={errors.password}
                    style={styles.passwordInput}
                    placeholder="Contraseña"
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.passwordToggle}
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon size={20} color={theme.colors.text.secondary} />
                    ) : (
                      <EyeIcon size={20} color={theme.colors.text.secondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {/* Botones */}
                <View style={styles.buttonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    onPress={handleLogin}
                    disabled={isLoading}
                    style={styles.loginButton}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color={theme.colors.common.white} />
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                  {/* Botón Face ID solo si biometría activada y disponible */}
                  {biometricsEnabled && canUseBiometrics && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      style={styles.loginButton}
                      onPress={async () => {
                        setIsLoading(true);
                        try {
                          const result = await authService.authenticateWithBiometrics();
                          if (result) {
                            if (onLoginSuccess) onLoginSuccess();
                          } else {
                            Alert.alert('Error', 'Autenticación biométrica fallida');
                          }
                        } catch (e) {
                          Alert.alert('Error', 'No se pudo usar Face ID');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      Iniciar con Face ID
                    </Button>
                  )}
                </View>
              </View>
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50', // Color base más oscuro para contrastar con la imagen
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backgroundMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  loginCard: {
    padding: 32,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    elevation: 12,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fondo semi-transparente
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoText: {
    color: theme.colors.common.white,
    fontWeight: '800',
    fontSize: 32,
    letterSpacing: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  loginSection: {
    width: '100%',
  },
  formContainer: {
    gap: 20,
  },
  input: {
    marginBottom: 4,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    marginBottom: 4,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  backButton: {
    flex: 1,
  },
  loginButton: {
    flex: 2,
  },
});

export default Login;
