import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../styles/theme';

interface ChipProps {
  label: string;
  variant?: 'filled' | 'outlined' | 'tonal';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  size?: 'small' | 'medium';
  onPress?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'filled',
  color = 'default',
  size = 'medium',
  onPress,
  onDelete,
  disabled = false,
  style,
}) => {
  const getChipStyle = (): ViewStyle => {
    const baseStyle = styles.chip;
    const sizeStyle = getSizeStyle();
    const variantStyle = getVariantStyle();
    const disabledStyle = disabled ? styles.disabled : {};

    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      ...disabledStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = styles.text;
    const sizeTextStyle = getSizeTextStyle();
    const variantTextStyle = getVariantTextStyle();

    return {
      ...baseStyle,
      ...sizeTextStyle,
      ...variantTextStyle,
    };
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          height: 24,
          paddingHorizontal: theme.spacing.sm,
        };
      default: // medium
        return {
          height: 32,
          paddingHorizontal: theme.spacing.md,
        };
    }
  };

  const getSizeTextStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return {
          fontSize: 12,
        };
      default: // medium
        return {
          fontSize: 14,
        };
    }
  };

  const getVariantStyle = (): ViewStyle => {
    let backgroundColor: string;
    let borderColor: string;
    
    switch (color) {
      case 'primary':
        backgroundColor = variant === 'filled' ? theme.colors.primary.main : 
                         variant === 'tonal' ? theme.colors.primary.lighterOpacity : 'transparent';
        borderColor = theme.colors.primary.main;
        break;
      case 'secondary':
        backgroundColor = variant === 'filled' ? theme.colors.secondary.main : 
                         variant === 'tonal' ? theme.colors.secondary.lighterOpacity : 'transparent';
        borderColor = theme.colors.secondary.main;
        break;
      case 'error':
        backgroundColor = variant === 'filled' ? theme.colors.error.main : 
                         variant === 'tonal' ? theme.colors.error.lighterOpacity : 'transparent';
        borderColor = theme.colors.error.main;
        break;
      case 'warning':
        backgroundColor = variant === 'filled' ? theme.colors.warning.main : 
                         variant === 'tonal' ? theme.colors.warning.lighterOpacity : 'transparent';
        borderColor = theme.colors.warning.main;
        break;
      case 'info':
        backgroundColor = variant === 'filled' ? theme.colors.info.main : 
                         variant === 'tonal' ? theme.colors.info.lighterOpacity : 'transparent';
        borderColor = theme.colors.info.main;
        break;
      case 'success':
        backgroundColor = variant === 'filled' ? theme.colors.success.main : 
                         variant === 'tonal' ? theme.colors.success.lighterOpacity : 'transparent';
        borderColor = theme.colors.success.main;
        break;
      default:
        backgroundColor = variant === 'filled' ? theme.colors.grey[500] : 
                         variant === 'tonal' ? theme.colors.grey[200] : 'transparent';
        borderColor = theme.colors.grey[500];
        break;
    }
    
    return {
      backgroundColor,
      ...(variant === 'outlined' && {
        borderWidth: 1,
        borderColor,
      }),
    };
  };

  const getVariantTextStyle = (): TextStyle => {
    let textColor: string;
    
    switch (color) {
      case 'primary':
        textColor = variant === 'filled' ? theme.colors.primary.contrastText : theme.colors.primary.main;
        break;
      case 'secondary':
        textColor = variant === 'filled' ? theme.colors.secondary.contrastText : theme.colors.secondary.main;
        break;
      case 'error':
        textColor = variant === 'filled' ? theme.colors.error.contrastText : theme.colors.error.main;
        break;
      case 'warning':
        textColor = variant === 'filled' ? theme.colors.warning.contrastText : theme.colors.warning.main;
        break;
      case 'info':
        textColor = variant === 'filled' ? theme.colors.info.contrastText : theme.colors.info.main;
        break;
      case 'success':
        textColor = variant === 'filled' ? theme.colors.success.contrastText : theme.colors.success.main;
        break;
      default:
        textColor = variant === 'filled' ? theme.colors.common.white : theme.colors.grey[700];
        break;
    }
    
    return {
      color: textColor,
    };
  };

  const handlePress = () => {
    if (disabled) return;
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      style={[getChipStyle(), style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <Text style={getTextStyle()}>{label}</Text>
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          disabled={disabled}
        >
          <Text style={[styles.deleteIcon, getVariantTextStyle()]}>×</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.round,
  },
  text: {
    fontWeight: '500',
  },
  deleteButton: {
    marginLeft: theme.spacing.xs,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
