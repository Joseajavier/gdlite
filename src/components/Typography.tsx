import React from 'react';
import { Text, TextStyle } from 'react-native';
import { theme } from '../styles/theme';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'button' | 'caption';
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  style?: TextStyle;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'textPrimary',
  align = 'left',
  children,
  style,
}) => {
  const getTextStyle = (): TextStyle => {
    const baseStyle = theme.typography[variant];
    const colorStyle = getColorStyle(color);
    const alignStyle = { textAlign: align };
    
    return {
      ...baseStyle,
      ...colorStyle,
      ...alignStyle,
    };
  };

  const getColorStyle = (colorProp: string): TextStyle => {
    switch (colorProp) {
      case 'primary':
        return { color: theme.colors.primary.main };
      case 'secondary':
        return { color: theme.colors.secondary.main };
      case 'error':
        return { color: theme.colors.error.main };
      case 'textSecondary':
        return { color: theme.colors.text.secondary };
      default:
        return { color: theme.colors.text.primary };
    }
  };

  return (
    <Text style={[getTextStyle(), style]}>
      {children}
    </Text>
  );
};
