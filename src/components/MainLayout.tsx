import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  onUserMenuToggle?: () => void;
  bottomNav?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onUserMenuToggle, bottomNav }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Navbar onUserMenuToggle={onUserMenuToggle} />
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
