import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { database, GameData } from '@/lib/database';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plane, DollarSign, MapPin } from 'lucide-react-native';

interface City {
  id: string;
  name: string;
  cost: number;
  image: string;
  description: string;
  unlocked: boolean;
}

export default function TravelScreen() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await database.getCurrentUser();
    if (!currentUser) {
      router.replace('/(auth)/login');
      return;
    }
    
    setUser(currentUser);
    const userData = await database.getGameData(currentUser.id);
    if (userData) {
      setGameData(userData);
    }
  };

  const cities: City[] = [
    {
      id: 'dubai',
      name: 'Dubai',
      cost: 0,
      image: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'City of Gold - Luxury and opportunity',
      unlocked: true,
    },
    {
      id: 'milano',
      name: 'Milano',
      cost: 15000,
      image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Fashion Capital - Style and business',
      unlocked: gameData?.cash >= 15000 || false,
    },
    {
      id: 'paris',
      name: 'Paris',
      cost: 20000,
      image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'City of Light - Art and culture',
      unlocked: gameData?.cash >= 20000 || false,
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      cost: 35000,
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tech Hub - Innovation and tradition',
      unlocked: gameData?.cash >= 35000 || false,
    },
    {
      id: 'newyork',
      name: 'New York',
      cost: 40000,
      image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Big Apple - Wall Street and dreams',
      unlocked: gameData?.cash >= 40000 || false,
    },
    {
      id: 'monaco',
      name: 'Monaco',
      cost: 60000,
      image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Monte Carlo - Ultimate luxury',
      unlocked: gameData?.cash >= 60000 || false,
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

  const handleTravel = async (city: City) => {
    if (!user || !gameData) return;

    if (gameData.currentCity === city.id) {
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

    if (gameData.cash < city.cost) {
      Alert.alert(
        'Insufficient Funds',
        `You need ${formatPrice(city.cost - gameData.cash)} more to travel to ${city.name}.`
      );
      return;
    }

    Alert.alert(
      'Travel Confirmation',
      `Travel to ${city.name} for ${city.cost === 0 ? 'FREE' : formatPrice(city.cost)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Travel', 
          onPress: async () => {
            const updatedData = await database.updateGameData(user.id, {
              cash: gameData.cash - city.cost,
              currentCity: city.id,
              stats: {
                ...gameData.stats,
                citiesVisited: gameData.stats.citiesVisited + (gameData.currentCity !== city.id ? 1 : 0)
              }
            });
            setGameData(updatedData);
            Alert.alert('Welcome!', `You've traveled to ${city.name}!`);
          }
        },
      ]
    );
  };

  if (!gameData) return null;

  return (
    <LinearGradient colors={['#0f0f23', '#1a1a2e']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#FFD700" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>✈️ PRIVATE JET</Text>
        <View style={styles.cashDisplay}>
          <DollarSign color="#FFD700" size={20} />
          <Text style={styles.cashText}>{formatPrice(gameData.cash)}</Text>
        </View>
      </View>

      <View style={styles.currentLocation}>
        <MapPin color="#4CAF50" size={20} />
        <Text style={styles.currentLocationText}>
          Currently in: {cities.find(c => c.id === gameData.currentCity)?.name || 'Unknown'}
        </Text>
      </View>

      <ScrollView style={styles.cityList} showsVerticalScrollIndicator={false}>
        {cities.map((city) => (
          <TouchableOpacity
            key={city.id}
            style={[
              styles.cityCard,
              gameData.currentCity === city.id && styles.currentCityCard,
              !city.unlocked && styles.lockedCityCard,
            ]}
            onPress={() => handleTravel(city)}
            disabled={gameData.currentCity === city.id}
          >
            <Image source={{ uri: city.image }} style={styles.cityImage} />
            
            <View style={styles.cityOverlay}>
              <View style={styles.cityInfo}>
                <Text style={[
                  styles.cityName,
                  gameData.currentCity === city.id && styles.currentCityName
                ]}>
                  {city.name}
                  {gameData.currentCity === city.id && ' (Current)'}
                </Text>
                <Text style={styles.cityDescription}>{city.description}</Text>
                <Text style={[
                  styles.cityPrice,
                  !city.unlocked && styles.lockedPrice
                ]}>
                  {city.cost === 0 ? 'FREE' : formatPrice(city.cost)}
                </Text>
              </View>
              
              <View style={styles.cityStatus}>
                {gameData.currentCity === city.id ? (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>HERE</Text>
                  </View>
                ) : city.unlocked ? (
                  <View style={styles.availableBadge}>
                    <Plane color="#000" size={16} />
                  </View>
                ) : (
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedBadgeText}>LOCKED</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
    textAlign: 'center',
  },
  cashDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cashText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  currentLocationText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cityList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cityCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    height: 200,
  },
  currentCityCard: {
    borderColor: '#4CAF50',
  },
  lockedCityCard: {
    opacity: 0.6,
    borderColor: '#555',
  },
  cityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cityOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityInfo: {
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
    padding: 12,
    borderRadius: 25,
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
});