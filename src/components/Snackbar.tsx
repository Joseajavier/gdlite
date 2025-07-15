import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { theme } from '../styles/theme';

interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  duration?: number;
  action?: React.ReactNode;
  severity?: 'default' | 'success' | 'warning' | 'error' | 'info';
  style?: ViewStyle;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  open,
  onClose,
  message,
  duration = 4000,
  action,
  severity = 'default',
  style,
}) => {
  const translateY = React.useRef(new Animated.Value(100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      // Animate in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close if duration is set
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open, duration, onClose, translateY, opacity]);

  const getBackgroundColor = () => {
    switch (severity) {
      case 'success':
        return theme.colors.success.main;
      case 'warning':
        return theme.colors.warning.main;
      case 'error':
        return theme.colors.error.main;
      case 'info':
        return theme.colors.info.main;
      default:
        return theme.colors.grey[800];
    }
  };

  const getTextColor = () => {
    switch (severity) {
      case 'success':
        return theme.colors.success.contrastText;
      case 'warning':
        return theme.colors.warning.contrastText;
      case 'error':
        return theme.colors.error.contrastText;
      case 'info':
        return theme.colors.info.contrastText;
      default:
        return theme.colors.common.white;
    }
  };

  if (!open) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.snackbar,
          {
            backgroundColor: getBackgroundColor(),
            transform: [{ translateY }],
            opacity,
          },
          style,
        ]}
      >
        <Typography
          variant="body2"
          style={[
            styles.message,
            { color: getTextColor() },
          ]}
        >
          {message}
        </Typography>
        
        {action && (
          <View style={styles.actionContainer}>
            {action}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 6,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    minHeight: 48,
  },
  message: {
    flex: 1,
    marginRight: 8,
  },
  actionContainer: {
    marginLeft: 8,
  },
});
