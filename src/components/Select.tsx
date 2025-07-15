import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, Modal, FlatList } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../styles/theme';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  style?: ViewStyle;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Selecciona una opción',
  disabled = false,
  error = false,
  helperText,
  variant = 'outlined',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleOptionPress = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];

    if (variant === 'outlined') {
      baseStyle.push(styles.outlined);
    } else if (variant === 'filled') {
      baseStyle.push(styles.filled);
    } else {
      baseStyle.push(styles.standard);
    }

    if (error) {
      baseStyle.push(styles.error);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.value === value && styles.selectedOption,
      ]}
      onPress={() => handleOptionPress(item.value)}
    >
      <Typography
        variant="body1"
        style={[
          styles.optionText,
          item.value === value && styles.selectedOptionText,
        ]}
      >
        {item.label}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Typography variant="body2" style={styles.label}>
          {label}
        </Typography>
      )}
      
      <TouchableOpacity
        style={getContainerStyle()}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Typography
          variant="body1"
          style={[
            styles.valueText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Typography>
        
        <Typography style={styles.arrow}>
          {isOpen ? '▲' : '▼'}
        </Typography>
      </TouchableOpacity>

      {helperText && (
        <Typography
          variant="caption"
          style={[
            styles.helperText,
            error && styles.errorText,
          ]}
        >
          {helperText}
        </Typography>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
    color: theme.colors.text.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.background.paper,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  filled: {
    backgroundColor: theme.colors.action.hover,
  },
  standard: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    borderRadius: 0,
  },
  error: {
    borderColor: theme.colors.error.main,
  },
  disabled: {
    backgroundColor: theme.colors.action.disabled,
    opacity: 0.6,
  },
  valueText: {
    flex: 1,
    color: theme.colors.text.primary,
  },
  placeholderText: {
    color: theme.colors.text.secondary,
  },
  arrow: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 8,
  },
  helperText: {
    marginTop: 4,
    color: theme.colors.text.secondary,
  },
  errorText: {
    color: theme.colors.error.main,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: 8,
    maxHeight: 300,
    minWidth: 200,
    elevation: 8,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary.lightOpacity,
  },
  optionText: {
    color: theme.colors.text.primary,
  },
  selectedOptionText: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
});
