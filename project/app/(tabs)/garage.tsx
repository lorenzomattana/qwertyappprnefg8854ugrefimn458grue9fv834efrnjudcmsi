import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { database, GameData } from '@/lib/database';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Car, Zap, DollarSign } from 'lucide-react-native';

interface Vehicle {
  id: string;
  name: string;
  price: number;
  speed: number;
  image: string;
  description: string;
  unlocked: boolean;
}

export default function GarageScreen() {
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

  const vehicles: Vehicle[] = [
    {
      id: 'basic',
      name: 'Basic Car',
      price: 0,
      speed: 1,
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Your starter vehicle',
      unlocked: true,
    },
    {
      id: 'bmw',
      name: 'BMW M3',
      price: 25000,
      speed: 1.3,
      image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'German engineering at its finest',
      unlocked: gameData?.unlockedCars.includes('bmw') || false,
    },
    {
      id: 'lambo',
      name: 'Lamborghini Huracán',
      price: 80000,
      speed: 1.8,
      image: 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Italian supercar excellence',
      unlocked: gameData?.unlockedCars.includes('lambo') || false,
    },
    {
      id: 'bugatti',
      name: 'Bugatti Chiron',
      price: 250000,
      speed: 2.5,
      image: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'The ultimate hypercar',
      unlocked: gameData?.unlockedCars.includes('bugatti') || false,
    },
    {
      id: 'rolls',
      name: 'Rolls Royce Phantom',
      price: 180000,
      speed: 1.5,
      image: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Luxury redefined',
      unlocked: gameData?.unlockedCars.includes('rolls') || false,
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

  const handlePurchase = async (vehicle: Vehicle) => {
    if (!user || !gameData) return;

    if (vehicle.unlocked) {
      // Select car
      await database.updateGameData(user.id, { currentCar: vehicle.id });
      setGameData({ ...gameData, currentCar: vehicle.id });
      Alert.alert('Success!', `You selected the ${vehicle.name}!`);
      return;
    }

    if (gameData.cash < vehicle.price) {
      Alert.alert(
        'Insufficient Funds',
        `You need ${formatPrice(vehicle.price - gameData.cash)} more to buy this vehicle.`
      );
      return;
    }

    Alert.alert(
      'Purchase Vehicle',
      `Are you sure you want to buy ${vehicle.name} for ${formatPrice(vehicle.price)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Buy', 
          onPress: async () => {
            const updatedData = await database.updateGameData(user.id, {
              cash: gameData.cash - vehicle.price,
              unlockedCars: [...gameData.unlockedCars, vehicle.id],
              currentCar: vehicle.id,
              stats: {
                ...gameData.stats,
                carsOwned: gameData.stats.carsOwned + 1
              }
            });
            setGameData(updatedData);
            Alert.alert('Success!', `You purchased the ${vehicle.name}!`);
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
        <Text style={styles.title}>🏎️ LUXURY GARAGE</Text>
        <View style={styles.cashDisplay}>
          <DollarSign color="#FFD700" size={20} />
          <Text style={styles.cashText}>{formatPrice(gameData.cash)}</Text>
        </View>
      </View>

      <ScrollView style={styles.vehicleList} showsVerticalScrollIndicator={false}>
        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
            
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleDescription}>{vehicle.description}</Text>
              
              <View style={styles.vehicleStats}>
                <View style={styles.statItem}>
                  <DollarSign color="#FFD700" size={16} />
                  <Text style={styles.statText}>
                    {vehicle.price === 0 ? 'Free' : formatPrice(vehicle.price)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Zap color="#4CAF50" size={16} />
                  <Text style={styles.statText}>Speed: {vehicle.speed}x</Text>
                </View>
              </View>
            </View>

            <View style={styles.vehicleActions}>
              {vehicle.unlocked ? (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    gameData.currentCar === vehicle.id ? styles.activeButton : styles.selectButton
                  ]}
                  onPress={() => handlePurchase(vehicle)}
                >
                  <Text style={[
                    styles.actionButtonText,
                    gameData.currentCar === vehicle.id ? styles.activeButtonText : styles.selectButtonText
                  ]}>
                    {gameData.currentCar === vehicle.id ? 'ACTIVE' : 'SELECT'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.purchaseButton,
                    gameData.cash < vehicle.price && styles.purchaseButtonDisabled
                  ]}
                  onPress={() => handlePurchase(vehicle)}
                  disabled={gameData.cash < vehicle.price}
                >
                  <Text style={[
                    styles.actionButtonText,
                    styles.purchaseButtonText,
                    gameData.cash < vehicle.price && styles.purchaseButtonTextDisabled
                  ]}>
                    BUY
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
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
  vehicleList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  vehicleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  vehicleInfo: {
    padding: 20,
  },
  vehicleName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  vehicleDescription: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 15,
  },
  vehicleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
  },
  vehicleActions: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  selectButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  purchaseButton: {
    backgroundColor: '#FFD700',
  },
  purchaseButtonDisabled: {
    backgroundColor: '#555',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: '#FFF',
  },
  selectButtonText: {
    color: '#FFD700',
  },
  purchaseButtonText: {
    color: '#000',
  },
  purchaseButtonTextDisabled: {
    color: '#888',
  },
});