import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../styles/theme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  label?: string;
  labelPlacement?: 'start' | 'end';
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  color = 'primary',
  size = 'medium',
  label,
  labelPlacement = 'end',
}) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const getTrackColor = () => {
    if (disabled) {
      return theme.colors.grey[300];
    }
    if (value) {
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
        default:
          return theme.colors.primary.main;
      }
    }
    return theme.colors.grey[300];
  };

  const getThumbColor = () => {
    if (disabled) {
      return theme.colors.grey[400];
    }
    return theme.colors.common.white;
  };

  const trackStyle = [
    styles.track,
    size === 'small' && styles.trackSmall,
    { backgroundColor: getTrackColor() },
  ];

  const thumbStyle = [
    styles.thumb,
    size === 'small' && styles.thumbSmall,
    { backgroundColor: getThumbColor() },
    {
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [2, size === 'small' ? 18 : 22],
          }),
        },
      ],
    },
  ];

  const switchComponent = (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={trackStyle}>
        <Animated.View style={thumbStyle} />
      </View>
    </TouchableOpacity>
  );

  if (label) {
    return (
      <View style={styles.labelContainer}>
        {labelPlacement === 'start' && (
          <Typography
            variant="body2"
            style={[styles.label, disabled && styles.labelDisabled].filter(Boolean)}
          >
            {label}
          </Typography>
        )}
        {switchComponent}
        {labelPlacement === 'end' && (
          <Typography
            variant="body2"
            style={[styles.label, disabled && styles.labelDisabled].filter(Boolean)}
          >
            {label}
          </Typography>
        )}
      </View>
    );
  }

  return switchComponent;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  trackSmall: {
    width: 36,
    height: 20,
    borderRadius: 10,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    elevation: 2,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: theme.colors.text.primary,
  },
  labelDisabled: {
    color: theme.colors.text.disabled,
  },
});
