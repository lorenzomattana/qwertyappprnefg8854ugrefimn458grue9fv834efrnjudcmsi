import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { database, GameData } from '@/lib/database';
import { AssetManager } from '@/components/AssetManager';
import { GameEngine } from '@/components/GameEngine';
import { GameHUD } from '@/components/GameHUD';
import { WorkOnPC } from '@/components/WorkOnPC';

export default function GameScreen() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [currentView, setCurrentView] = useState<'game' | 'laptop'>('game');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
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

  const updateGameData = async (updates: Partial<GameData>) => {
    if (!user || !gameData) return;
    
    try {
      const updatedData = await database.updateGameData(user.id, updates);
      setGameData(updatedData);
    } catch (error) {
      console.error('Failed to update game data:', error);
    }
  };

  const onWorkComplete = (earnings: number) => {
    if (!gameData) return;
    
    const newCash = gameData.cash + earnings;
    const newXP = gameData.xp + Math.floor(earnings / 100);
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    updateGameData({
      cash: newCash,
      xp: newXP,
      level: newLevel,
      completedJobs: gameData.completedJobs + 1,
      stats: {
        ...gameData.stats,
        totalEarnings: gameData.stats.totalEarnings + earnings,
        jobsCompleted: gameData.stats.jobsCompleted + 1
      }
    });
    
    setCurrentView('game');
    
    // Show achievement notifications
    if (newLevel > gameData.level) {
      Alert.alert('Level Up!', `Congratulations! You reached level ${newLevel}!`);
    }
  };

  if (!user || !gameData) {
    return null;
  }

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
            gameData={gameData}
            onInteractLaptop={() => setCurrentView('laptop')}
            onInteractGarage={() => router.push('/(tabs)/garage')}
            onInteractAirport={() => router.push('/(tabs)/travel')}
          />
          <GameHUD
            cash={gameData.cash}
            xp={gameData.xp}
            level={gameData.level}
            currentCity={gameData.currentCity}
            currentCar={gameData.currentCar}
          />
        </>
      )}
      
      {currentView === 'laptop' && (
        <WorkOnPC
          onComplete={onWorkComplete}
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