import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Animated } from 'react-native';
import { theme } from '../styles/theme';

interface FabProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  variant?: 'circular' | 'extended';
  style?: ViewStyle;
}

export const Fab: React.FC<FabProps> = ({
  children,
  onPress,
  disabled = false,
  color = 'primary',
  size = 'medium',
  variant = 'circular',
  style,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 56;
      case 'large':
        return 64;
      default:
        return 56;
    }
  };

  const getColors = () => {
    switch (color) {
      case 'primary':
        return {
          main: theme.colors.primary.main,
          contrastText: theme.colors.primary.contrastText,
        };
      case 'secondary':
        return {
          main: theme.colors.secondary.main,
          contrastText: theme.colors.secondary.contrastText,
        };
      case 'success':
        return {
          main: theme.colors.success.main,
          contrastText: theme.colors.success.contrastText,
        };
      case 'warning':
        return {
          main: theme.colors.warning.main,
          contrastText: theme.colors.warning.contrastText,
        };
      case 'error':
        return {
          main: theme.colors.error.main,
          contrastText: theme.colors.error.contrastText,
        };
      case 'info':
        return {
          main: theme.colors.info.main,
          contrastText: theme.colors.info.contrastText,
        };
      default:
        return {
          main: theme.colors.primary.main,
          contrastText: theme.colors.primary.contrastText,
        };
    }
  };

  const getButtonStyle = () => {
    const buttonSize = getSize();
    const colors = getColors();
    
    const baseStyle = {
      backgroundColor: colors.main,
      elevation: 6,
      shadowColor: theme.colors.common.black,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
    };

    if (variant === 'extended') {
      return {
        ...baseStyle,
        height: buttonSize,
        minWidth: buttonSize,
        borderRadius: buttonSize / 2,
        paddingHorizontal: 16,
      };
    }

    return {
      ...baseStyle,
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
    };
  };

  const buttonStyle = [
    styles.button,
    getButtonStyle(),
    disabled && styles.disabled,
    style,
  ];

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
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
    elevation: 0,
    shadowOpacity: 0,
  },
});
