import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GameState, Vehicle } from '@/types/GameState';

interface VehicleGarageProps {
  gameState: GameState;
  onPurchase: (carType: string, price: number) => void;
  onClose: () => void;
}

export const VehicleGarage: React.FC<VehicleGarageProps> = ({ gameState, onPurchase, onClose }) => {
  const vehicles: Vehicle[] = [
    {
      id: 'basic',
      name: 'Basic Car',
      price: 0,
      speed: 1,
      image: '🚗',
      unlocked: true,
    },
    {
      id: 'bmw',
      name: 'BMW M3',
      price: 25000,
      speed: 1.3,
      image: '🏎️',
      unlocked: gameState.unlockedCars.includes('bmw'),
    },
    {
      id: 'lambo',
      name: 'Lamborghini Huracán',
      price: 80000,
      speed: 1.8,
      image: '🏎️',
      unlocked: gameState.unlockedCars.includes('lambo'),
    },
    {
      id: 'bugatti',
      name: 'Bugatti Chiron',
      price: 250000,
      speed: 2.5,
      image: '🚗',
      unlocked: gameState.unlockedCars.includes('bugatti'),
    },
    {
      id: 'rolls',
      name: 'Rolls Royce Phantom',
      price: 180000,
      speed: 1.5,
      image: '🚐',
      unlocked: gameState.unlockedCars.includes('rolls'),
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

  const handlePurchase = (vehicle: Vehicle) => {
    if (vehicle.unlocked) {
      Alert.alert('Already Owned', 'You already own this vehicle!');
      return;
    }

    if (gameState.cash < vehicle.price) {
      Alert.alert(
        'Insufficient Funds',
        `You need ${formatPrice(vehicle.price - gameState.cash)} more to buy this vehicle.`
      );
      return;
    }

    Alert.alert(
      'Purchase Vehicle',
      `Are you sure you want to buy ${vehicle.name} for ${formatPrice(vehicle.price)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy', onPress: () => onPurchase(vehicle.id, vehicle.price) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Luxury Car Garage</Text>
      <Text style={styles.subtitle}>Your Collection</Text>
      
      <ScrollView style={styles.vehicleList} showsVerticalScrollIndicator={false}>
        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleIcon}>{vehicle.image}</Text>
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleName}>{vehicle.name}</Text>
                <Text style={styles.vehiclePrice}>
                  {vehicle.price === 0 ? 'Free' : formatPrice(vehicle.price)}
                </Text>
                <Text style={styles.vehicleSpeed}>
                  Speed: {vehicle.speed}x
                </Text>
              </View>
            </View>
            
            <View style={styles.vehicleActions}>
              {vehicle.unlocked ? (
                <View style={styles.ownedBadge}>
                  <Text style={styles.ownedText}>
                    {gameState.currentCar === vehicle.id ? 'Active' : 'Owned'}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.purchaseButton,
                    gameState.cash < vehicle.price && styles.purchaseButtonDisabled
                  ]}
                  onPress={() => handlePurchase(vehicle)}
                  disabled={gameState.cash < vehicle.price}
                >
                  <Text style={[
                    styles.purchaseButtonText,
                    gameState.cash < vehicle.price && styles.purchaseButtonTextDisabled
                  ]}>
                    Buy
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.bottomSection}>
        <View style={styles.cashDisplay}>
          <Text style={styles.cashText}>
            Available Cash: {formatPrice(gameState.cash)}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Exit Garage</Text>
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
  vehicleList: {
    flex: 1,
  },
  vehicleCard: {
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
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleIcon: {
    fontSize: 40,
    marginRight: 20,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  vehiclePrice: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  vehicleSpeed: {
    fontSize: 14,
    color: '#AAA',
  },
  vehicleActions: {
    alignItems: 'center',
  },
  ownedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ownedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  purchaseButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  purchaseButtonDisabled: {
    backgroundColor: '#555',
  },
  purchaseButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  purchaseButtonTextDisabled: {
    color: '#888',
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