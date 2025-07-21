import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
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
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  icon,
  gifSource,
  infoIcon,
  infoText,
}) => {
  return (
    <View style={styles.modernCard}>
      <View style={gifSource ? styles.gifSection : styles.cardIconSection}>
        {gifSource ? (
          <Image source={gifSource} style={{ width: 90, height: 90 }} resizeMode="contain" />
        ) : icon ? (
          <MaterialIcons name={icon} size={32} color="#444" />
        ) : null}
      </View>
      <View style={styles.cardContentSection}>
        <Typography variant="h4" style={styles.cardTitle}>{title}</Typography>
        <View style={styles.cardInfoRow}>
          {infoIcon && <MaterialIcons name={infoIcon} size={18} color="#444" style={styles.cardInfoIcon} />}
          <Typography variant="body2" style={styles.cardInfoText}>{infoText}</Typography>
        </View>
        <Typography variant="body2" style={styles.cardSubtitle}>{subtitle}</Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modernCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 130,
    padding: 14,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
    marginVertical: 8,
    marginHorizontal: 8,
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
  },
  cardSubtitle: {
    color: '#444',
    fontSize: 12,
    marginTop: 2,
  },
});

export default DashboardCard;
