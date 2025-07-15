import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../styles/theme';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number | 'small' | 'medium' | 'large';
  variant?: 'circular' | 'rounded' | 'square';
  children?: React.ReactNode;
  style?: ViewStyle;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'medium',
  variant = 'circular',
  children,
  style,
  color = 'primary',
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 40;
      case 'large':
        return 56;
      default:
        return typeof size === 'number' ? size : 40;
    }
  };

  const getBorderRadius = () => {
    const avatarSize = getSize();
    switch (variant) {
      case 'circular':
        return avatarSize / 2;
      case 'rounded':
        return 8;
      case 'square':
        return 0;
      default:
        return avatarSize / 2;
    }
  };

  const getBackgroundColor = () => {
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

  const avatarSize = getSize();
  const borderRadius = getBorderRadius();

  const avatarStyle = [
    styles.avatar,
    {
      width: avatarSize,
      height: avatarSize,
      borderRadius,
      backgroundColor: src ? 'transparent' : getBackgroundColor(),
    },
    style,
  ];

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFontSize = () => {
    const currentSize = getSize();
    return Math.floor(currentSize * 0.4);
  };

  if (src) {
    return (
      <View style={avatarStyle}>
        <Image
          source={{ uri: src }}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius,
            },
          ]}
          resizeMode="cover"
        />
      </View>
    );
  }

  if (children) {
    return (
      <View style={avatarStyle}>
        {children}
      </View>
    );
  }

  // Fallback con iniciales
  const initials = alt ? getInitials(alt) : '?';
  
  return (
    <View style={avatarStyle}>
      <Typography
        variant="body2"
        style={[
          styles.initials,
          {
            fontSize: getFontSize(),
            color: theme.colors.common.white,
          },
        ]}
      >
        {initials}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
