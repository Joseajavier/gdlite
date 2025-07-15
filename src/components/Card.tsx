import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'low',
  style,
}) => {
  const getElevationStyle = () => {
    switch (elevation) {
      case 'none':
        return {};
      case 'medium':
        return theme.shadows.medium;
      case 'high':
        return theme.shadows.large;
      default: // low
        return theme.shadows.small;
    }
  };

  return (
    <View style={[styles.card, getElevationStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
  },
});
