import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { AssetManager } from '@/components/AssetManager';
import { GameEngine } from '@/components/GameEngine';
import { GameHUD } from '@/components/GameHUD';
import { WorkOnPC } from '@/components/WorkOnPC';
import { VehicleGarage } from '@/components/VehicleGarage';
import { CitySelector } from '@/components/CitySelector';
import { GameState } from '@/types/GameState';
import { saveGameState, loadGameState } from '@/utils/storage';

export default function Game() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    cash: 5000,
    xp: 0,
    currentCity: 'dubai',
    unlockedCars: ['basic'],
    currentCar: 'basic',
    completedJobs: 0,
    position: { x: 0, y: 0, z: 0 }
  });
  const [currentView, setCurrentView] = useState<'game' | 'laptop' | 'garage' | 'travel'>('game');

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      const savedState = await loadGameState();
      if (savedState) {
        setGameState(savedState);
      }
    } catch (error) {
      console.log('No saved game found, starting new game');
    }
  };

  const saveGameData = async (newState: GameState) => {
    try {
      await saveGameState(newState);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  const updateGameState = (updates: Partial<GameState>) => {
    const newState = { ...gameState, ...updates };
    setGameState(newState);
    saveGameData(newState);
  };

  const onWorkComplete = (earnings: number) => {
    const newCash = gameState.cash + earnings;
    const newXP = gameState.xp + Math.floor(earnings / 100);
    
    updateGameState({
      cash: newCash,
      xp: newXP,
      completedJobs: gameState.completedJobs + 1
    });
    
    setCurrentView('game');
  };

  const onCarPurchase = (carType: string, price: number) => {
    if (gameState.cash >= price) {
      updateGameState({
        cash: gameState.cash - price,
        unlockedCars: [...gameState.unlockedCars, carType],
        currentCar: carType
      });
      Alert.alert('Success!', `You purchased a ${carType}!`);
    } else {
      Alert.alert('Insufficient Funds', 'You need more money to buy this car.');
    }
    setCurrentView('game');
  };

  const onCityTravel = (cityName: string, cost: number) => {
    if (gameState.cash >= cost) {
      updateGameState({
        cash: gameState.cash - cost,
        currentCity: cityName
      });
      Alert.alert('Welcome!', `You've traveled to ${cityName}!`);
    } else {
      Alert.alert('Insufficient Funds', 'You need more money to travel.');
    }
    setCurrentView('game');
  };

  if (!assetsLoaded) {
    return (
      <View style={styles.container}>
        <AssetManager onAssetsLoaded={() => setAssetsLoaded(true)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentView === 'game' && (
        <>
          <GameEngine
            gameState={gameState}
            onInteractLaptop={() => setCurrentView('laptop')}
            onInteractGarage={() => setCurrentView('garage')}
            onInteractAirport={() => setCurrentView('travel')}
          />
          <GameHUD
            cash={gameState.cash}
            xp={gameState.xp}
            currentCity={gameState.currentCity}
            currentCar={gameState.currentCar}
          />
        </>
      )}
      
      {currentView === 'laptop' && (
        <WorkOnPC
          onComplete={onWorkComplete}
          onClose={() => setCurrentView('game')}
        />
      )}
      
      {currentView === 'garage' && (
        <VehicleGarage
          gameState={gameState}
          onPurchase={onCarPurchase}
          onClose={() => setCurrentView('game')}
        />
      )}
      
      {currentView === 'travel' && (
        <CitySelector
          gameState={gameState}
          onTravel={onCityTravel}
          onClose={() => setCurrentView('game')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});