import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../styles/theme';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'inset' | 'middle';
  flexItem?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
  textAlign?: 'left' | 'center' | 'right';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'fullWidth',
  flexItem = false,
  children,
  style,
  textAlign = 'center',
}) => {
  const isHorizontal = orientation === 'horizontal';

  if (children) {
    return (
      <View style={[styles.withTextContainer, style]}>
        <View style={styles.dividerLine} />
        <View style={styles.textContainer}>
          {typeof children === 'string' ? (
            <Typography variant="body2" style={styles.text}>
              {children}
            </Typography>
          ) : (
            children
          )}
        </View>
        <View style={styles.dividerLine} />
      </View>
    );
  }

  return (
    <View
      style={[
        isHorizontal ? styles.horizontal : styles.vertical,
        flexItem && styles.flexItem,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.grey[300],
  },
  vertical: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.grey[300],
  },
  flexItem: {
    alignSelf: 'stretch',
  },
  withTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.grey[300],
  },
  textContainer: {
    backgroundColor: theme.colors.background.default,
    paddingHorizontal: 16,
  },
  text: {
    color: theme.colors.text.secondary,
  },
});
