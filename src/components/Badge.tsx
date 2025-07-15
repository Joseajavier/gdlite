import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../styles/theme';

interface BadgeProps {
  children: React.ReactNode;
  badgeContent?: string | number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'standard' | 'dot';
  invisible?: boolean;
  showZero?: boolean;
  max?: number;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  badgeContent,
  color = 'error',
  variant = 'standard',
  invisible = false,
  showZero = false,
  max = 99,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'right',
  },
  style,
}) => {
  const shouldShowBadge = () => {
    if (invisible) return false;
    if (variant === 'dot') return true;
    if (badgeContent === undefined || badgeContent === null) return false;
    if (typeof badgeContent === 'number') {
      return badgeContent > 0 || showZero;
    }
    return badgeContent.toString().length > 0;
  };

  const getBadgeContent = () => {
    if (variant === 'dot') return null;
    if (typeof badgeContent === 'number' && badgeContent > max) {
      return `${max}+`;
    }
    return badgeContent?.toString();
  };

  const getBadgeColor = () => {
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
        return theme.colors.error.main;
    }
  };

  const getBadgePosition = () => {
    const { vertical, horizontal } = anchorOrigin;
    const position: any = { position: 'absolute' };

    if (vertical === 'top') {
      position.top = -6;
    } else {
      position.bottom = -6;
    }

    if (horizontal === 'right') {
      position.right = -6;
    } else {
      position.left = -6;
    }

    return position;
  };

  const badgeStyle = [
    styles.badge,
    variant === 'dot' ? styles.dot : styles.standard,
    {
      backgroundColor: getBadgeColor(),
      ...getBadgePosition(),
    },
  ];

  return (
    <View style={[styles.container, style]}>
      {children}
      {shouldShowBadge() && (
        <View style={badgeStyle}>
          {variant === 'standard' && (
            <Typography
              variant="caption"
              style={{
                ...styles.badgeText,
                color: theme.colors.common.white,
              }}
            >
              {getBadgeContent()}
            </Typography>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minWidth: 20,
    minHeight: 20,
    elevation: 2,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  standard: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    minWidth: 8,
    minHeight: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
  },
});
