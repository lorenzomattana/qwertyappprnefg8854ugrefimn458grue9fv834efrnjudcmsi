import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GameHUDProps {
  cash: number;
  xp: number;
  level: number;
  currentCity: string;
  currentCar: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ cash, xp, level, currentCity, currentCar }) => {
  const formatCash = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getXPProgress = (xp: number) => {
    return (xp % 1000) / 1000;
  };

  const capitalizeCity = (city: string) => {
    return city.charAt(0).toUpperCase() + city.slice(1);
  };

  return (
    <View style={styles.hudContainer}>
      {/* Top HUD */}
      <View style={styles.topHUD}>
        <View style={styles.cashContainer}>
          <Text style={styles.cashLabel}>💰 Cash</Text>
          <Text style={styles.cashAmount}>{formatCash(cash)}</Text>
        </View>
        
        <View style={styles.xpContainer}>
          <Text style={styles.xpLabel}>⭐ Level {level}</Text>
          <View style={styles.xpBar}>
            <View 
              style={[
                styles.xpProgress, 
                { width: `${getXPProgress(xp) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.xpText}>{xp % 1000}/1000 XP</Text>
        </View>
      </View>

      {/* Bottom HUD */}
      <View style={styles.bottomHUD}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>📍 {capitalizeCity(currentCity)}</Text>
        </View>
        
        <View style={styles.carContainer}>
          <Text style={styles.carLabel}>🚗 {currentCar}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  topHUD: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
    pointerEvents: 'none',
  },
  cashContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 10,
    minWidth: 120,
  },
  cashLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cashAmount: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  xpContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  xpLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  xpBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  xpText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  bottomHUD: {
    position: 'absolute',
    bottom: 180,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  locationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  locationLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  carContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  carLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});