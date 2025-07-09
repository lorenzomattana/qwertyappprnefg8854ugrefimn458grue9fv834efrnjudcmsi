import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Text, TouchableOpacity, Platform } from 'react-native';
import { GameData } from '@/lib/database';

interface GameEngineProps {
  gameData: GameData;
  onInteractLaptop: () => void;
  onInteractGarage: () => void;
  onInteractAirport: () => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  gameData,
  onInteractLaptop,
  onInteractGarage,
  onInteractAirport
}) => {
  const [nearInteraction, setNearInteraction] = useState<string | null>(null);
  const playerPosition = useRef({ x: 0, y: 0, z: 0 });
  const joystickCenter = useRef({ x: 0, y: 0 });
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [cameraAngle, setCameraAngle] = useState(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      joystickCenter.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
    },
    onPanResponderMove: (evt) => {
      const deltaX = evt.nativeEvent.pageX - joystickCenter.current.x;
      const deltaY = evt.nativeEvent.pageY - joystickCenter.current.y;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 50;
      
      if (distance <= maxDistance) {
        setJoystickPosition({ x: deltaX, y: deltaY });
      } else {
        const angle = Math.atan2(deltaY, deltaX);
        setJoystickPosition({
          x: Math.cos(angle) * maxDistance,
          y: Math.sin(angle) * maxDistance
        });
      }
      
      // Update player position with smoother movement
      const speed = 0.02;
      playerPosition.current.x += deltaX * speed;
      playerPosition.current.z += deltaY * speed;
      
      // Update camera angle based on movement
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setCameraAngle(Math.atan2(deltaY, deltaX));
      }
      
      // Check for interactions
      checkInteractions();
    },
    onPanResponderRelease: () => {
      setJoystickPosition({ x: 0, y: 0 });
    }
  });

  const checkInteractions = () => {
    const { x, z } = playerPosition.current;
    
    // Check if near laptop (apartment area)
    if (Math.abs(x - 2) < 1.5 && Math.abs(z - 2) < 1.5) {
      setNearInteraction('laptop');
    }
    // Check if near garage
    else if (Math.abs(x - (-3)) < 2 && Math.abs(z - 1) < 2) {
      setNearInteraction('garage');
    }
    // Check if near airport
    else if (Math.abs(x - 5) < 2 && Math.abs(z - (-3)) < 2) {
      setNearInteraction('airport');
    }
    else {
      setNearInteraction(null);
    }
  };

  const getCityBackground = (cityName: string) => {
    const cityBackgrounds: { [key: string]: string } = {
      dubai: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)',
      milano: 'linear-gradient(180deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
      paris: 'linear-gradient(180deg, #4169E1 0%, #6495ED 50%, #87CEEB 100%)',
      tokyo: 'linear-gradient(180deg, #FF69B4 0%, #FF1493 50%, #DC143C 100%)',
      newyork: 'linear-gradient(180deg, #708090 0%, #2F4F4F 50%, #000000 100%)',
      monaco: 'linear-gradient(180deg, #00CED1 0%, #20B2AA 50%, #008B8B 100%)',
    };
    return cityBackgrounds[cityName] || cityBackgrounds.dubai;
  };

  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {/* 3D Game World Simulation */}
      <View style={[styles.gameWorld, { background: getCityBackground(gameData.currentCity) }]}>
        {/* Sky and Environment */}
        <View style={styles.skybox}>
          <Text style={styles.cityLabel}>{gameData.currentCity.toUpperCase()}</Text>
        </View>

        {/* Buildings and Environment */}
        <View style={styles.environment}>
          {/* Luxury Apartment */}
          <View style={[styles.building, styles.apartment, {
            transform: [
              { translateX: 100 + playerPosition.current.x * -20 },
              { translateY: 50 + playerPosition.current.z * -10 }
            ]
          }]}>
            <Text style={styles.buildingLabel}>🏢</Text>
            <Text style={styles.buildingText}>Penthouse</Text>
          </View>

          {/* Garage */}
          <View style={[styles.building, styles.garage, {
            transform: [
              { translateX: 50 + playerPosition.current.x * -15 },
              { translateY: 200 + playerPosition.current.z * -8 }
            ]
          }]}>
            <Text style={styles.buildingLabel}>🏗️</Text>
            <Text style={styles.buildingText}>Garage</Text>
          </View>

          {/* Airport */}
          <View style={[styles.building, styles.airport, {
            transform: [
              { translateX: 250 + playerPosition.current.x * -25 },
              { translateY: 300 + playerPosition.current.z * -12 }
            ]
          }]}>
            <Text style={styles.buildingLabel}>✈️</Text>
            <Text style={styles.buildingText}>Airport</Text>
          </View>

          {/* Player Character */}
          <View style={[styles.player, {
            transform: [
              { translateX: width / 2 },
              { translateY: height / 2 },
              { rotate: `${cameraAngle}rad` }
            ]
          }]}>
            <Text style={styles.playerIcon}>🚶‍♂️</Text>
          </View>
        </View>
      </View>
      
      {/* Enhanced Virtual Joystick */}
      <View style={styles.joystickContainer} {...panResponder.panHandlers}>
        <View style={styles.joystickBase}>
          <View style={styles.joystickRing} />
          <View 
            style={[
              styles.joystickKnob,
              {
                transform: [
                  { translateX: joystickPosition.x },
                  { translateY: joystickPosition.y }
                ]
              }
            ]}
          />
        </View>
        <Text style={styles.joystickLabel}>MOVE</Text>
      </View>

      {/* Camera Controls */}
      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.cameraButton}>
          <Text style={styles.cameraButtonText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton}>
          <Text style={styles.cameraButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Enhanced Interaction Prompt */}
      {nearInteraction && (
        <View style={styles.interactionPrompt}>
          <View style={styles.interactionContent}>
            <Text style={styles.interactionIcon}>
              {nearInteraction === 'laptop' && '💻'}
              {nearInteraction === 'garage' && '🚗'}
              {nearInteraction === 'airport' && '✈️'}
            </Text>
            <Text style={styles.interactionText}>
              {nearInteraction === 'laptop' && 'Work on Laptop'}
              {nearInteraction === 'garage' && 'Enter Garage'}
              {nearInteraction === 'airport' && 'Travel'}
            </Text>
            <TouchableOpacity
              style={styles.interactionButton}
              onPress={() => {
                if (nearInteraction === 'laptop') onInteractLaptop();
                else if (nearInteraction === 'garage') onInteractGarage();
                else if (nearInteraction === 'airport') onInteractAirport();
              }}
            >
              <Text style={styles.interactionButtonText}>INTERACT</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Mini Map */}
      <View style={styles.miniMap}>
        <Text style={styles.miniMapTitle}>MAP</Text>
        <View style={styles.miniMapContent}>
          <View style={[styles.miniMapDot, styles.playerDot]} />
          <View style={[styles.miniMapDot, styles.laptopDot]} />
          <View style={[styles.miniMapDot, styles.garageDot]} />
          <View style={[styles.miniMapDot, styles.airportDot]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameWorld: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  skybox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 100%)',
  },
  cityLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Orbitron-Bold',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  environment: {
    flex: 1,
    position: 'relative',
  },
  building: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  apartment: {
    width: 80,
    height: 120,
    backgroundColor: 'rgba(139, 69, 19, 0.9)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  garage: {
    width: 70,
    height: 60,
    backgroundColor: 'rgba(105, 105, 105, 0.9)',
    borderWidth: 2,
    borderColor: '#C0C0C0',
  },
  airport: {
    width: 60,
    height: 40,
    backgroundColor: 'rgba(0, 0, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#87CEEB',
  },
  buildingLabel: {
    fontSize: 24,
    marginBottom: 5,
  },
  buildingText: {
    fontSize: 10,
    color: '#FFF',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  player: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  playerIcon: {
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  joystickContainer: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    width: 120,
    height: 120,
    alignItems: 'center',
  },
  joystickBase: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 215, 0, 0.8)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  joystickRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  joystickKnob: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  joystickLabel: {
    marginTop: 8,
    fontSize: 10,
    color: '#FFD700',
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    gap: 15,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.8)',
  },
  cameraButtonText: {
    fontSize: 20,
  },
  interactionPrompt: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  interactionContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },
  interactionIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  interactionText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
  },
  interactionButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  interactionButtonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
  miniMap: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 100,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  miniMapTitle: {
    color: '#FFD700',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  miniMapContent: {
    flex: 1,
    position: 'relative',
  },
  miniMapDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  playerDot: {
    backgroundColor: '#00FF00',
    top: 40,
    left: 40,
  },
  laptopDot: {
    backgroundColor: '#FFD700',
    top: 20,
    left: 60,
  },
  garageDot: {
    backgroundColor: '#C0C0C0',
    top: 50,
    left: 20,
  },
  airportDot: {
    backgroundColor: '#87CEEB',
    top: 60,
    left: 70,
  },
});