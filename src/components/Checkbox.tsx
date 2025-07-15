import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Animated } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../styles/theme';

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  indeterminate?: boolean;
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  value,
  onValueChange,
  color = 'primary',
  disabled = false,
  size = 'medium',
  indeterminate = false,
  style,
}) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value || indeterminate ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, indeterminate, animatedValue]);

  const getCheckboxColor = () => {
    if (disabled) return theme.colors.action.disabled;
    
    switch (color) {
      case 'primary':
        return theme.colors.primary.main;
      case 'secondary':
        return theme.colors.secondary.main;
      case 'success':
        return theme.colors.success.main;
      case 'warning':
        return theme.colors.warning.main;
      case 'error':
        return theme.colors.error.main;
      case 'info':
        return theme.colors.info.main;
      default:
        return theme.colors.primary.main;
    }
  };

  const getCheckboxSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const checkboxSize = getCheckboxSize();
  const checkboxColor = getCheckboxColor();

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      value || indeterminate ? checkboxColor : 'transparent',
      checkboxColor,
    ],
  });

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.colors.action.disabled,
      checkboxColor,
    ],
  });

  const checkOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.checkbox,
          {
            width: checkboxSize,
            height: checkboxSize,
            backgroundColor,
            borderColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.checkmark,
            {
              opacity: checkOpacity,
            },
          ]}
        >
          {indeterminate ? (
            <Typography
              style={[
                styles.indeterminateIcon,
                {
                  fontSize: checkboxSize * 0.6,
                  color: theme.colors.common.white,
                },
              ]}
            >
              −
            </Typography>
          ) : (
            <Typography
              style={[
                styles.checkIcon,
                {
                  fontSize: checkboxSize * 0.6,
                  color: theme.colors.common.white,
                },
              ]}
            >
              ✓
            </Typography>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  checkmark: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  indeterminateIcon: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
