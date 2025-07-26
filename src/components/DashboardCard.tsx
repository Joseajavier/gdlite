import React from 'react';
import { View, StyleSheet, Image, TextStyle, StyleProp } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Typography } from './Typography';
interface DashboardCardProps {
  title: string;
  subtitle: string;
  icon?: string;
  gifSource?: any;
  onPress?: () => void;
  infoIcon?: string;
  infoText?: string;
  left?: React.ReactNode;
  footer?: React.ReactNode;
  cardStyle?: any;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  infoTextStyle?: StyleProp<TextStyle>;
  infoIconColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  icon,
  gifSource,
  // onPress, // removed to fix unused variable error
  infoIcon,
  infoText,
  left,
  footer,
  cardStyle,
  titleStyle,
  subtitleStyle,
  infoTextStyle,
  infoIconColor,
}) => {
  return (
    <View style={[styles.modernCard, cardStyle]}>
      {footer && <View style={styles.cardFooterAbsolute}>{footer}</View>}
      {left ? (
        <View style={styles.cardIconSection}>{left}</View>
      ) : (
        <View style={gifSource ? styles.gifSection : styles.cardIconSection}>
          {gifSource ? (
            <Image source={gifSource} style={styles.gifImage} resizeMode="contain" />
          ) : (typeof icon === 'string' ? (
            <MaterialIcons name={icon} size={32} color="#444" />
          ) : null)}
        </View>
      )}
      <View style={styles.cardContentSection}>
        <Typography
          variant="h4"
          style={StyleSheet.flatten([styles.cardTitle, titleStyle])}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Typography>
        <View style={styles.cardInfoRow}>
          {infoIcon && <MaterialIcons name={infoIcon} size={18} color={infoIconColor || "#444"} style={styles.cardInfoIcon} />}
          <Typography variant="body2" style={StyleSheet.flatten([styles.cardInfoText, infoTextStyle])}>{infoText}</Typography>
        </View>
        <Typography
          variant="body2"
          style={StyleSheet.flatten([styles.cardSubtitle, subtitleStyle])}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {subtitle}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modernCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 130,
    padding: 14,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#666CFF',
    shadowColor: '#666CFF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16,
    marginVertical: 12,
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  cardIconSection: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  gifSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContentSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  cardInfoIcon: {
    marginRight: 6,
  },
  cardInfoText: {
    color: '#222',
    fontSize: 13,
    fontWeight: '500',
  },
  cardTitle: {
    color: '#111',
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 18,
    letterSpacing: 1.2,
    maxWidth: 220,
  },
  cardSubtitle: {
    color: '#444',
    fontSize: 12,
    marginTop: 2,
    maxWidth: 220,
  },
  gifImage: {
    width: 90,
    height: 90,
  },
  cardFooterAbsolute: {
    position: 'absolute',
    top: 8,
    right: 10,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 8,
    paddingHorizontal: 2,
    paddingVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default DashboardCard;
