import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Typography } from '../components/Typography';
import { theme } from '../styles/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
}

const Calendario: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Eventos de ejemplo
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Reunión de trabajo',
      time: '09:00',
      date: '2025-07-15',
    },
    {
      id: '2',
      title: 'Presentación proyecto',
      time: '14:30',
      date: '2025-07-16',
    },
    {
      id: '3',
      title: 'Revisión documentos',
      time: '11:00',
      date: '2025-07-18',
    },
  ]);

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive', 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

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
        handleLogout();
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
        // Ya estamos en calendario, no hacer nada
        break;
      default:
        Alert.alert('Navegación', `Funcionalidad de ${screen} en desarrollo`);
    }
  };

  // Funciones del calendario
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[date.getMonth()];
  };

  const getPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const isSelectedDate = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const hasEvent = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => event.date === dateStr);
  };

  const getEventsForSelectedDate = () => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const selectDate = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Días vacíos del mes anterior
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.emptyDay} />
      );
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const isSelected = isSelectedDate(day);
      const dayHasEvent = hasEvent(day);
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            isCurrentDay && styles.todayButton,
            isSelected && styles.selectedDayButton,
          ]}
          onPress={() => selectDate(day)}
        >
          <Text style={[
            styles.dayText,
            isCurrentDay && styles.todayText,
            isSelected && styles.selectedDayText,
          ]}>
            {day}
          </Text>
          {dayHasEvent && <View style={styles.eventDot} />}
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.main} />
      
      <View style={styles.content}>
        {/* Navbar Content */}
        <View style={styles.navbarContent}>
          <View style={styles.navbarLeftSection}>
            <TouchableOpacity style={styles.navToggle}>
              <Typography variant="h4" style={styles.navIcon}>☰</Typography>
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Typography variant="h6" style={styles.logoText}>Calendario</Typography>
            </View>
          </View>

          <View style={styles.navbarRightSection}>
            <TouchableOpacity onPress={handleUserMenuToggle} style={styles.navbarUserAction}>
              <Typography variant="h6" style={styles.navIcon}>👤</Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Menu Dropdown */}
        {showUserMenu && (
          <View style={styles.userMenuContainer}>
            <View style={styles.userMenu}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuOption('profile')}
              >
                <Typography style={styles.menuIcon}>👤</Typography>
                <Typography style={styles.menuText}>Mi Perfil</Typography>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuOption('settings')}
              >
                <Typography style={styles.menuIcon}>⚙️</Typography>
                <Typography style={styles.menuText}>Configuración</Typography>
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuOption('logout')}
              >
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

        {/* Main Content Area */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={getPreviousMonth} style={styles.monthButton}>
              <Text style={styles.monthButtonText}>‹</Text>
            </TouchableOpacity>
            
            <View style={styles.monthContainer}>
              <Text style={styles.monthText}>
                {getMonthName(currentDate)} {currentDate.getFullYear()}
              </Text>
            </View>
            
            <TouchableOpacity onPress={getNextMonth} style={styles.monthButton}>
              <Text style={styles.monthButtonText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Days of Week */}
          <View style={styles.weekDaysContainer}>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <View key={day} style={styles.weekDay}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {renderCalendar()}
          </View>

          {/* Events for Selected Date */}
          <View style={styles.eventsSection}>
            <Text style={styles.eventsSectionTitle}>
              Eventos para {selectedDate.getDate()} de {getMonthName(selectedDate)}
            </Text>
            
            {getEventsForSelectedDate().length > 0 ? (
              getEventsForSelectedDate().map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventTime}>
                    <Text style={styles.eventTimeText}>{event.time}</Text>
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noEventsText}>No hay eventos programados</Text>
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => handleBottomNavigation('home')}
          >
            <Typography style={styles.navItemIcon}>🏠</Typography>
            <Typography style={styles.navItemText}>Inicio</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => handleBottomNavigation('portafirmas')}
          >
            <Typography style={styles.navItemIcon}>🖊️</Typography>
            <Typography style={styles.navItemText}>Portafirmas</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => handleBottomNavigation('avisos')}
          >
            <Typography style={styles.navItemIcon}>📢</Typography>
            <Typography style={styles.navItemText}>Avisos</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, styles.navItemActive]}
            onPress={() => handleBottomNavigation('calendario')}
          >
            <Typography style={styles.navItemIconActive}>📅</Typography>
            <Typography style={styles.navItemTextActive}>Calendario</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => handleBottomNavigation('ia')}
          >
            <Typography style={styles.navItemIcon}>🤖</Typography>
            <Typography style={styles.navItemText}>IA</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  logoContainer: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoText: {
    color: theme.colors.common.white,
    fontWeight: '800',
    letterSpacing: 1,
  },
  // NavbarContent styles
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#666CFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navbarLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navbarRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navToggle: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  navIcon: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // User Menu Dropdown styles
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
  // Calendar styles
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666CFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  emptyDay: {
    width: '14.28%',
    height: 40,
  },
  dayButton: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayButton: {
    backgroundColor: '#666CFF20',
    borderRadius: 20,
  },
  selectedDayButton: {
    backgroundColor: '#666CFF',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#333333',
  },
  todayText: {
    color: '#666CFF',
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF6B6B',
  },
  // Events section
  eventsSection: {
    marginTop: 8,
  },
  eventsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventTime: {
    marginRight: 12,
    paddingVertical: 4,
  },
  eventTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666CFF',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  noEventsText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  // Bottom Navigation styles
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
  navItemIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#999999',
  },
  navIconGif: {
    width: 20,
    height: 20,
    marginBottom: 4,
    tintColor: '#999999',
  },
  navItemIconActive: {
    fontSize: 20,
    marginBottom: 4,
    color: '#FFFFFF',
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

export default Calendario;
