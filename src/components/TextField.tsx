import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../styles/theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: boolean;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error = false,
  helperText,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  startAdornment,
  endAdornment,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const getInputStyle = () => {
    const baseStyle = [
      styles.input,
      size === 'small' && styles.inputSmall,
      fullWidth && styles.fullWidth,
    ];

    switch (variant) {
      case 'outlined':
        return [
          ...baseStyle,
          styles.outlined,
          isFocused && styles.outlinedFocused,
          error && styles.outlinedError,
        ];
      case 'filled':
        return [
          ...baseStyle,
          styles.filled,
          isFocused && styles.filledFocused,
          error && styles.filledError,
        ];
      case 'standard':
        return [
          ...baseStyle,
          styles.standard,
          isFocused && styles.standardFocused,
          error && styles.standardError,
        ];
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth, style]}>
      {label && (
        <Typography
          variant="body2"
          style={[
            styles.label,
            isFocused && styles.labelFocused,
            error && styles.labelError,
          ].filter(Boolean)}
        >
          {label}
        </Typography>
      )}
      <View style={styles.inputContainer}>
        {startAdornment && (
          <View style={styles.adornment}>{startAdornment}</View>
        )}
        <TextInput
          {...props}
          style={getInputStyle()}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={theme.colors.text.disabled}
        />
        {endAdornment && (
          <View style={styles.adornment}>{endAdornment}</View>
        )}
      </View>
      {helperText && (
        <Typography
          variant="caption"
          style={[styles.helperText, error && styles.helperTextError].filter(Boolean)}
        >
          {helperText}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    marginBottom: 4,
    color: theme.colors.text.secondary,
  },
  labelFocused: {
    color: theme.colors.primary.main,
  },
  labelError: {
    color: theme.colors.error.main,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputSmall: {
    paddingVertical: 8,
    fontSize: 14,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.grey[300],
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  outlinedFocused: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
  },
  outlinedError: {
    borderColor: theme.colors.error.main,
  },
  filled: {
    backgroundColor: theme.colors.grey[100],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[300],
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  filledFocused: {
    backgroundColor: theme.colors.grey[200],
    borderBottomColor: theme.colors.primary.main,
    borderBottomWidth: 2,
  },
  filledError: {
    borderBottomColor: theme.colors.error.main,
  },
  standard: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[300],
    backgroundColor: 'transparent',
  },
  standardFocused: {
    borderBottomColor: theme.colors.primary.main,
    borderBottomWidth: 2,
  },
  standardError: {
    borderBottomColor: theme.colors.error.main,
  },
  adornment: {
    paddingHorizontal: 8,
  },
  helperText: {
    marginTop: 4,
    color: theme.colors.text.secondary,
  },
  helperTextError: {
    color: theme.colors.error.main,
  },
});
