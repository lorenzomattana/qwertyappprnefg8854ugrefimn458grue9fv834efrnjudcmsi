import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Asset } from 'expo-asset';

interface AssetManagerProps {
  onAssetsLoaded: () => void;
}

export const AssetManager: React.FC<AssetManagerProps> = ({ onAssetsLoaded }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoadingText('Loading game assets...');
      setLoadingProgress(0.1);

      // Simulate loading different asset types
      const assetSteps = [
        { text: 'Loading 3D models...', progress: 0.2 },
        { text: 'Loading textures...', progress: 0.4 },
        { text: 'Loading audio files...', progress: 0.6 },
        { text: 'Loading UI assets...', progress: 0.8 },
        { text: 'Finalizing...', progress: 1.0 }
      ];

      for (const step of assetSteps) {
        setLoadingText(step.text);
        setLoadingProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setLoadingText('Ready to play!');
      await new Promise(resolve => setTimeout(resolve, 500));
      onAssetsLoaded();
    } catch (error) {
      console.error('Error loading assets:', error);
      setLoadingText('Error loading assets. Please restart the app.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Millionaire Entrepreneur</Text>
      <Text style={styles.subtitle}>Life Simulation 3D</Text>
      
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>{loadingText}</Text>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${loadingProgress * 100}%` }
            ]} 
          />
        </View>
        
        <Text style={styles.progressText}>
          {Math.round(loadingProgress * 100)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 60,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 20,
    marginBottom: 30,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#AAA',
  },
});