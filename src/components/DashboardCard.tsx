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
    minHeight: 90, // Reducido de 130 a 90
    padding: 12, // Reducido de 14 a 12
    borderRadius: 18, // Reducido de 24 a 18
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#666CFF',
    shadowColor: '#666CFF',
    shadowOffset: { width: 0, height: 8 }, // Reducido de 12 a 8
    shadowOpacity: 0.25, // Reducido de 0.35 a 0.25
    shadowRadius: 16, // Reducido de 24 a 16
    elevation: 12, // Reducido de 16 a 12
    marginVertical: 8, // Reducido de 12 a 8
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  cardIconSection: {
    width: 40, // Reducido de 54 a 40
    height: 40, // Reducido de 54 a 40
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Reducido de 14 a 10
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  gifSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Reducido de 14 a 10
  },
  cardContentSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 3, // Reducido de 4 a 3
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // Reducido de 6 a 4
    gap: 4, // Reducido de 6 a 4
  },
  cardInfoIcon: {
    marginRight: 4, // Reducido de 6 a 4
  },
  cardInfoText: {
    color: '#222',
    fontSize: 11, // Reducido de 13 a 11
    fontWeight: '500',
  },
  cardTitle: {
    color: '#111',
    fontWeight: '700',
    marginBottom: 4, // Reducido de 8 a 4
    fontSize: 16, // Reducido de 18 a 16
    letterSpacing: 1.0, // Reducido de 1.2 a 1.0
    maxWidth: 220,
  },
  cardSubtitle: {
    color: '#444',
    fontSize: 11, // Reducido de 12 a 11
    marginTop: 1, // Reducido de 2 a 1
    maxWidth: 220,
  },
  gifImage: {
    width: 60, // Reducido de 90 a 60
    height: 60, // Reducido de 90 a 60
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
