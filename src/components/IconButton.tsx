import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

interface IconButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inherit';
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outlined' | 'text';
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onPress,
  disabled = false,
  color = 'inherit',
  size = 'medium',
  variant = 'text',
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 40;
      case 'large':
        return 48;
      default:
        return 40;
    }
  };

  const getColors = () => {
    switch (color) {
      case 'primary':
        return {
          main: theme.colors.primary.main,
          light: theme.colors.primary.light,
          contrastText: theme.colors.primary.contrastText,
        };
      case 'secondary':
        return {
          main: theme.colors.secondary.main,
          light: theme.colors.secondary.light,
          contrastText: theme.colors.secondary.contrastText,
        };
      case 'success':
        return {
          main: theme.colors.success.main,
          light: theme.colors.success.light,
          contrastText: theme.colors.success.contrastText,
        };
      case 'warning':
        return {
          main: theme.colors.warning.main,
          light: theme.colors.warning.light,
          contrastText: theme.colors.warning.contrastText,
        };
      case 'error':
        return {
          main: theme.colors.error.main,
          light: theme.colors.error.light,
          contrastText: theme.colors.error.contrastText,
        };
      case 'info':
        return {
          main: theme.colors.info.main,
          light: theme.colors.info.light,
          contrastText: theme.colors.info.contrastText,
        };
      default:
        return {
          main: theme.colors.text.primary,
          light: theme.colors.grey[200],
          contrastText: theme.colors.text.primary,
        };
    }
  };

  const getButtonStyle = () => {
    const buttonSize = getSize();
    const colors = getColors();
    
    const baseStyle = {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: colors.main,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.main,
        };
      case 'text':
      default:
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
    }
  };

  const buttonStyle = [
    styles.button,
    getButtonStyle(),
    disabled && styles.disabled,
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});
