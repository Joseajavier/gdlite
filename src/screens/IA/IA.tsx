import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Image, TextInput } from 'react-native';
import MainLayout from '../../components/MainLayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Typography } from '../../components/Typography';

// import { theme } from '../../styles/theme';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#F7F7FB',
    padding: 0,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F7F7FB',
    borderRadius: 16,
    margin: 16,
    marginBottom: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    backgroundColor: '#F7F7FB',
  },
  chatMessagesContent: {
    paddingBottom: 16,
  },
  userMsgRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  botMsgRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  userMsg: {
    backgroundColor: '#666CFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  botMsg: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  msgText: {
    fontSize: 15,
    color: '#222',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    backgroundColor: '#F7F7FB',
    fontSize: 15,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#666CFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  sendBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  userMenuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1000,
  },
  userMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuIcon: {
    fontSize: 16,
    color: '#666CFF',
  },
  menuText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
    marginHorizontal: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#666CFF',
  },
  navIconGif: {
    width: 28,
    height: 28,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  navIconGifActive: {
    width: 28,
    height: 28,
    marginBottom: 4,
    // No tintColor para mantener el color original del gif
  },
  navItemText: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '500',
    textAlign: 'center',
  },
  navItemTextActive: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});

const IA: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleUserMenuToggle = () => setShowUserMenu((v) => !v);
  const handleMenuOption = (option: string) => {
    setShowUserMenu(false);
    switch (option) {
      case 'profile':
        Alert.alert('Perfil', 'Funcionalidad en desarrollo');
        break;
      case 'settings':
        Alert.alert('Configuración', 'Funcionalidad en desarrollo');
        break;
      case 'logout':
        Alert.alert('Cerrar Sesión', 'Funcionalidad en desarrollo');
        break;
    }
  };
  const handleBottomNavigation = (screen: string) => {
    switch (screen) {
      case 'home':
        navigation.goBack();
        break;
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
        break;
      default:
        Alert.alert('Navegación', `Funcionalidad de ${screen} en desarrollo`);
    }
  };
  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = { sender: 'user', text: inputText };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Esta es una respuesta automática. (Aquí irá la integración real de IA)' }
      ]);
    }, 800);
  };
  return (
    <MainLayout
      title="Chat GestDoc"
      onUserMenuToggle={handleUserMenuToggle}
      bottomNav={
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.navItem} onPress={() => handleBottomNavigation('home')}>
            <Image source={require('../../assets/images/home.gif')} style={styles.navIconGif} resizeMode="contain" />
            <Typography style={styles.navItemText}>Inicio</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => handleBottomNavigation('portafirmas')}>
            <Image source={require('../../assets/images/firma-unscreen.gif')} style={styles.navIconGif} resizeMode="contain" />
            <Typography style={styles.navItemText}>Portafirmas</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => handleBottomNavigation('avisos')}>
            <Image source={require('../../assets/images/notificacion-unscreen.gif')} style={styles.navIconGif} resizeMode="contain" />
            <Typography style={styles.navItemText}>Avisos</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => handleBottomNavigation('calendario')}>
            <Image source={require('../../assets/images/calendar.gif')} style={styles.navIconGif} resizeMode="contain" />
            <Typography style={styles.navItemText}>Calendario</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]} onPress={() => handleBottomNavigation('ia')}>
            <Image source={require('../../assets/images/inteligencia-artificial.gif')} style={styles.navIconGifActive} resizeMode="contain" />
            <Typography style={styles.navItemTextActive}>IA</Typography>
          </TouchableOpacity>
        </View>
      }
    >
      <View style={styles.content}>
        {/* User Menu Dropdown */}
        {showUserMenu && (
          <View style={styles.userMenuContainer}>
            <View style={styles.userMenu}>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('profile')}>
                <Typography style={styles.menuIcon}>👤</Typography>
                <Typography style={styles.menuText}>Mi Perfil</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('settings')}>
                <Typography style={styles.menuIcon}>⚙️</Typography>
                <Typography style={styles.menuText}>Configuración</Typography>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('logout')}>
                <Typography style={styles.menuIcon}>🚪</Typography>
                <Typography style={styles.menuText}>Cerrar Sesión</Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* Overlay for closing menu */}
        {showUserMenu && (
          <Modal
            transparent={true}
            visible={showUserMenu}
            onRequestClose={() => setShowUserMenu(false)}
          >
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setShowUserMenu(false)}
            />
          </Modal>
        )}
        {/* Chat Bot Area */}
        <View style={styles.chatContainer}>
          <ScrollView
            style={styles.chatMessages}
            contentContainerStyle={styles.chatMessagesContent}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {chatMessages.map((msg, idx) => (
              <View
                key={idx}
                style={msg.sender === 'user' ? styles.userMsgRow : styles.botMsgRow}
              >
                <View style={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>
                  <Typography style={styles.msgText}>{msg.text}</Typography>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Escribe tu mensaje..."
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Typography style={styles.sendBtnText}>Enviar</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </MainLayout>
  );
};





export default IA;
