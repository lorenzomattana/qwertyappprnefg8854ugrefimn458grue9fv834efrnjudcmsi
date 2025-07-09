import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GameState, City } from '@/types/GameState';

interface CitySelectorProps {
  gameState: GameState;
  onTravel: (cityName: string, cost: number) => void;
  onClose: () => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ gameState, onTravel, onClose }) => {
  const cities: City[] = [
    {
      id: 'dubai',
      name: 'Dubai',
      cost: 0,
      unlocked: true,
    },
    {
      id: 'milano',
      name: 'Milano',
      cost: 15000,
      unlocked: gameState.cash >= 15000,
    },
    {
      id: 'paris',
      name: 'Paris',
      cost: 20000,
      unlocked: gameState.cash >= 20000,
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      cost: 35000,
      unlocked: gameState.cash >= 35000,
    },
    {
      id: 'newyork',
      name: 'New York',
      cost: 40000,
      unlocked: gameState.cash >= 40000,
    },
    {
      id: 'monaco',
      name: 'Monaco',
      cost: 60000,
      unlocked: gameState.cash >= 60000,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCityIcon = (cityId: string) => {
    const icons: { [key: string]: string } = {
      dubai: '🏙️',
      milano: '🏛️',
      paris: '🗼',
      tokyo: '🌸',
      newyork: '🗽',
      monaco: '🏰',
    };
    return icons[cityId] || '🌍';
  };

  const getCityDescription = (cityId: string) => {
    const descriptions: { [key: string]: string } = {
      dubai: 'City of Gold - Luxury and opportunity',
      milano: 'Fashion Capital - Style and business',
      paris: 'City of Light - Art and culture',
      tokyo: 'Tech Hub - Innovation and tradition',
      newyork: 'Big Apple - Wall Street and dreams',
      monaco: 'Monte Carlo - Ultimate luxury',
    };
    return descriptions[cityId] || 'A new adventure awaits';
  };

  const handleTravel = (city: City) => {
    if (gameState.currentCity === city.id) {
      Alert.alert('Already Here', `You're already in ${city.name}!`);
      return;
    }

    if (!city.unlocked) {
      Alert.alert(
        'City Locked',
        `You need at least ${formatPrice(city.cost)} to unlock ${city.name}.`
      );
      return;
    }

    if (gameState.cash < city.cost) {
      Alert.alert(
        'Insufficient Funds',
        `You need ${formatPrice(city.cost - gameState.cash)} more to travel to ${city.name}.`
      );
      return;
    }

    Alert.alert(
      'Travel Confirmation',
      `Travel to ${city.name} for ${city.cost === 0 ? 'FREE' : formatPrice(city.cost)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Travel', onPress: () => onTravel(city.id, city.cost) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Private Jet Terminal</Text>
      <Text style={styles.subtitle}>Choose your destination</Text>
      
      <ScrollView style={styles.cityList} showsVerticalScrollIndicator={false}>
        {cities.map((city) => (
          <TouchableOpacity
            key={city.id}
            style={[
              styles.cityCard,
              gameState.currentCity === city.id && styles.currentCityCard,
              !city.unlocked && styles.lockedCityCard,
            ]}
            onPress={() => handleTravel(city)}
            disabled={gameState.currentCity === city.id}
          >
            <View style={styles.cityInfo}>
              <Text style={styles.cityIcon}>{getCityIcon(city.id)}</Text>
              <View style={styles.cityDetails}>
                <Text style={[
                  styles.cityName,
                  gameState.currentCity === city.id && styles.currentCityName
                ]}>
                  {city.name}
                  {gameState.currentCity === city.id && ' (Current)'}
                </Text>
                <Text style={styles.cityDescription}>
                  {getCityDescription(city.id)}
                </Text>
                <Text style={[
                  styles.cityPrice,
                  !city.unlocked && styles.lockedPrice
                ]}>
                  {city.cost === 0 ? 'FREE' : formatPrice(city.cost)}
                </Text>
              </View>
            </View>
            
            <View style={styles.cityStatus}>
              {gameState.currentCity === city.id ? (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>HERE</Text>
                </View>
              ) : city.unlocked ? (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableBadgeText}>Available</Text>
                </View>
              ) : (
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedBadgeText}>Locked</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.bottomSection}>
        <View style={styles.cashDisplay}>
          <Text style={styles.cashText}>
            Available Cash: {formatPrice(gameState.cash)}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Exit Terminal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  cityList: {
    flex: 1,
  },
  cityCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#333',
  },
  currentCityCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#2a4a2a',
  },
  lockedCityCard: {
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
    opacity: 0.6,
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cityIcon: {
    fontSize: 40,
    marginRight: 20,
  },
  cityDetails: {
    flex: 1,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  currentCityName: {
    color: '#4CAF50',
  },
  cityDescription: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 8,
  },
  cityPrice: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  lockedPrice: {
    color: '#666',
  },
  cityStatus: {
    alignItems: 'center',
  },
  currentBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currentBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  availableBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  availableBadgeText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockedBadge: {
    backgroundColor: '#666',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lockedBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cashDisplay: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  cashText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});