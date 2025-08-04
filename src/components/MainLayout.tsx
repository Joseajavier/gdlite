import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Navbar from './Navbar';


interface MainLayoutProps {
  children: React.ReactNode;
  onUserMenuToggle?: () => void;
  bottomNav?: React.ReactNode;
  title?: string;
  navbarBgColor?: string;
  navbarTextColor?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onUserMenuToggle, bottomNav, title, navbarBgColor, navbarTextColor }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Navbar onUserMenuToggle={onUserMenuToggle} title={title} bgColor={navbarBgColor} textColor={navbarTextColor} />
      <View style={styles.content}>{children}</View>
      {bottomNav && <View style={styles.bottomNav}>{bottomNav}</View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    width: '100%',
  },
});

export default MainLayout;
