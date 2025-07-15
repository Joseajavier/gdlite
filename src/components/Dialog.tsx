import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, ViewStyle, ScrollView } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { Divider } from './Divider';
import { theme } from '../styles/theme';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = false,
  fullScreen = false,
  style,
}) => {
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'xs':
        return 320;
      case 'sm':
        return 400;
      case 'md':
        return 500;
      case 'lg':
        return 600;
      case 'xl':
        return 700;
      default:
        return 400;
    }
  };

  const dialogStyle = [
    styles.dialog,
    fullScreen && styles.fullScreen,
    !fullScreen && {
      maxWidth: fullWidth ? '90%' : getMaxWidth(),
      width: fullWidth ? '90%' : 'auto',
    },
    style,
  ];

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={dialogStyle}>
          {/* Header */}
          {title && (
            <View style={styles.header}>
              <Typography variant="h6" style={styles.title}>
                {title}
              </Typography>
              <IconButton
                onPress={onClose}
                color="inherit"
                size="small"
                style={styles.closeButton}
              >
                <Typography style={styles.closeIcon}>×</Typography>
              </IconButton>
            </View>
          )}
          
          {title && <Divider />}

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {children}
          </ScrollView>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <>
              <Divider />
              <View style={styles.actions}>
                {actions.map((action, index) => (
                  <View key={index} style={styles.actionItem}>
                    {action}
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialog: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: 12,
    elevation: 24,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    maxHeight: '80%',
    minWidth: 280,
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    margin: 0,
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    flex: 1,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  closeButton: {
    marginLeft: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  content: {
    maxHeight: '60%',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  actionItem: {
    marginLeft: 8,
  },
});
