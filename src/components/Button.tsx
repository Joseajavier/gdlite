import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../styles/theme';

interface ButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onPress,
  children,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.button;
    const variantStyle = getVariantStyle();
    const sizeStyle = getSizeStyle();
    const colorStyle = getColorStyle();
    const disabledStyle = disabled ? styles.disabled : {};

    return {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      ...colorStyle,
      ...disabledStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = styles.text;
    const variantTextStyle = getVariantTextStyle();
    const sizeTextStyle = getSizeTextStyle();

    return {
      ...baseStyle,
      ...variantTextStyle,
      ...sizeTextStyle,
    };
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors[color].main,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        };
      default: // contained
        return {
          backgroundColor: theme.colors[color].main,
        };
    }
  };

  const getVariantTextStyle = (): TextStyle => {
    switch (variant) {
      case 'outlined':
      case 'text':
        return {
          color: theme.colors[color].main,
        };
      default: // contained
        return {
          color: theme.colors[color].contrastText,
        };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          minHeight: 32,
        };
      case 'large':
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          minHeight: 48,
        };
      default: // medium
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs + 2,
          minHeight: 40,
        };
    }
  };

  const getSizeTextStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return {
          fontSize: 12,
        };
      case 'large':
        return {
          fontSize: 16,
        };
      default: // medium
        return {
          fontSize: 14,
        };
    }
  };

  const getColorStyle = (): ViewStyle => {
    if (variant === 'contained') {
      return {
        backgroundColor: theme.colors[color].main,
      };
    }
    return {};
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <Text style={[getTextStyle(), textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  text: {
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.5,
  },
});
