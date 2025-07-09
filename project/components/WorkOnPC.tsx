import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS 
} from 'react-native-reanimated';

interface WorkOnPCProps {
  onComplete: (earnings: number) => void;
  onClose: () => void;
}

type MiniGameType = 'video' | 'web' | 'crypto';

export const WorkOnPC: React.FC<WorkOnPCProps> = ({ onComplete, onClose }) => {
  const [selectedGame, setSelectedGame] = useState<MiniGameType | null>(null);
  const [videoClipsPlaced, setVideoClipsPlaced] = useState(0);
  const [cryptoPrice, setCryptoPrice] = useState(50000);
  const [webElementsPlaced, setWebElementsPlaced] = useState(0);

  const { width, height } = Dimensions.get('window');

  const startMiniGame = (gameType: MiniGameType) => {
    setSelectedGame(gameType);
    if (gameType === 'crypto') {
      // Simulate crypto price changes
      const interval = setInterval(() => {
        setCryptoPrice(prev => prev + (Math.random() - 0.5) * 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  };

  const VideoEditingGame = () => {
    const clip1X = useSharedValue(50);
    const clip1Y = useSharedValue(height - 200);
    const clip2X = useSharedValue(150);
    const clip2Y = useSharedValue(height - 200);
    const clip3X = useSharedValue(250);
    const clip3Y = useSharedValue(height - 200);

    const createDragHandler = (translateX: Animated.SharedValue<number>, translateY: Animated.SharedValue<number>) => {
      return useAnimatedGestureHandler({
        onStart: (_, context) => {
          context.startX = translateX.value;
          context.startY = translateY.value;
        },
        onActive: (event, context) => {
          translateX.value = context.startX + event.translationX;
          translateY.value = context.startY + event.translationY;
        },
        onEnd: (event) => {
          // Check if dropped in timeline area
          if (event.absoluteY < 300 && event.absoluteY > 150) {
            runOnJS(setVideoClipsPlaced)(prev => {
              const newValue = prev + 1;
              if (newValue === 3) {
                setTimeout(() => {
                  runOnJS(onComplete)(1000);
                }, 500);
              }
              return newValue;
            });
          } else {
            // Snap back to original position
            translateX.value = withSpring(translateX.value < width / 2 ? 50 : width - 100);
            translateY.value = withSpring(height - 200);
          }
        },
      });
    };

    const clipStyle = (translateX: Animated.SharedValue<number>, translateY: Animated.SharedValue<number>) => {
      return useAnimatedStyle(() => {
        return {
          transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
          ],
        };
      });
    };

    return (
      <View style={styles.miniGameContainer}>
        <Text style={styles.gameTitle}>Video Editing Studio</Text>
        <Text style={styles.gameInstructions}>
          Drag all 3 clips to the timeline and render for €1000
        </Text>
        
        <View style={styles.timeline}>
          <Text style={styles.timelineText}>
            Timeline ({videoClipsPlaced}/3 clips)
          </Text>
        </View>

        <PanGestureHandler onGestureEvent={createDragHandler(clip1X, clip1Y)}>
          <Animated.View style={[styles.videoClip, { backgroundColor: '#FF6B6B' }, clipStyle(clip1X, clip1Y)]}>
            <Text style={styles.clipText}>Clip 1</Text>
          </Animated.View>
        </PanGestureHandler>

        <PanGestureHandler onGestureEvent={createDragHandler(clip2X, clip2Y)}>
          <Animated.View style={[styles.videoClip, { backgroundColor: '#4ECDC4' }, clipStyle(clip2X, clip2Y)]}>
            <Text style={styles.clipText}>Clip 2</Text>
          </Animated.View>
        </PanGestureHandler>

        <PanGestureHandler onGestureEvent={createDragHandler(clip3X, clip3Y)}>
          <Animated.View style={[styles.videoClip, { backgroundColor: '#45B7D1' }, clipStyle(clip3X, clip3Y)]}>
            <Text style={styles.clipText}>Clip 3</Text>
          </Animated.View>
        </PanGestureHandler>

        {videoClipsPlaced === 3 && (
          <TouchableOpacity style={styles.renderButton} onPress={() => onComplete(1000)}>
            <Text style={styles.renderButtonText}>Render Video - €1000</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const WebDesignGame = () => {
    const elementTypes = ['Image', 'Title', 'Button'];
    
    return (
      <View style={styles.miniGameContainer}>
        <Text style={styles.gameTitle}>Web Design Studio</Text>
        <Text style={styles.gameInstructions}>
          Place image, title, and button on the webpage for €1500
        </Text>
        
        <View style={styles.webpage}>
          <Text style={styles.webpageText}>Your Website Preview</Text>
          <View style={styles.webpageContent}>
            {webElementsPlaced >= 1 && (
              <View style={styles.webElement}>
                <Text>🖼️ Hero Image</Text>
              </View>
            )}
            {webElementsPlaced >= 2 && (
              <View style={styles.webElement}>
                <Text style={styles.webTitle}>Amazing Product</Text>
              </View>
            )}
            {webElementsPlaced >= 3 && (
              <TouchableOpacity style={styles.webButton}>
                <Text style={styles.webButtonText}>Buy Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.webElements}>
          {elementTypes.map((element, index) => (
            index >= webElementsPlaced && (
              <TouchableOpacity
                key={element}
                style={styles.webElementButton}
                onPress={() => {
                  const newCount = webElementsPlaced + 1;
                  setWebElementsPlaced(newCount);
                  if (newCount === 3) {
                    setTimeout(() => onComplete(1500), 500);
                  }
                }}
              >
                <Text style={styles.webElementText}>Add {element}</Text>
              </TouchableOpacity>
            )
          ))}
        </View>
      </View>
    );
  };

  const CryptoTradingGame = () => {
    const [position, setPosition] = useState<'none' | 'long' | 'short'>('none');
    const [entryPrice, setEntryPrice] = useState(0);

    const trade = (direction: 'long' | 'short') => {
      if (position === 'none') {
        setPosition(direction);
        setEntryPrice(cryptoPrice);
      } else {
        // Close position
        const profit = direction === 'long' 
          ? (cryptoPrice - entryPrice) * 0.01
          : (entryPrice - cryptoPrice) * 0.01;
        
        const earnings = Math.max(-500, Math.min(2000, Math.round(profit)));
        setPosition('none');
        setEntryPrice(0);
        
        onComplete(earnings);
      }
    };

    return (
      <View style={styles.miniGameContainer}>
        <Text style={styles.gameTitle}>Crypto Trading</Text>
        <Text style={styles.gameInstructions}>
          Trade Bitcoin - Win €500-2000 or lose €500
        </Text>
        
        <View style={styles.cryptoChart}>
          <Text style={styles.cryptoPrice}>
            BTC: €{cryptoPrice.toFixed(0)}
          </Text>
          {position !== 'none' && (
            <Text style={styles.positionText}>
              Position: {position.toUpperCase()} @ €{entryPrice.toFixed(0)}
              {'\n'}
              P&L: €{position === 'long' 
                ? ((cryptoPrice - entryPrice) * 0.01).toFixed(0)
                : ((entryPrice - cryptoPrice) * 0.01).toFixed(0)}
            </Text>
          )}
        </View>

        <View style={styles.cryptoButtons}>
          <TouchableOpacity
            style={[styles.cryptoButton, styles.buyButton]}
            onPress={() => trade('long')}
          >
            <Text style={styles.cryptoButtonText}>
              {position === 'none' ? 'Buy Long' : 'Close Position'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.cryptoButton, styles.sellButton]}
            onPress={() => trade('short')}
          >
            <Text style={styles.cryptoButtonText}>
              {position === 'none' ? 'Sell Short' : 'Close Position'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (selectedGame === 'video') {
    return <VideoEditingGame />;
  } else if (selectedGame === 'web') {
    return <WebDesignGame />;
  } else if (selectedGame === 'crypto') {
    return <CryptoTradingGame />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Work Station</Text>
      <Text style={styles.subtitle}>Choose your hustle</Text>
      
      <View style={styles.gameSelection}>
        <TouchableOpacity
          style={styles.gameOption}
          onPress={() => startMiniGame('video')}
        >
          <Text style={styles.gameOptionIcon}>🎬</Text>
          <Text style={styles.gameOptionTitle}>Video Editing</Text>
          <Text style={styles.gameOptionReward}>€1,000</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.gameOption}
          onPress={() => startMiniGame('web')}
        >
          <Text style={styles.gameOptionIcon}>🌐</Text>
          <Text style={styles.gameOptionTitle}>Web Design</Text>
          <Text style={styles.gameOptionReward}>€1,500</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.gameOption}
          onPress={() => startMiniGame('crypto')}
        >
          <Text style={styles.gameOptionIcon}>₿</Text>
          <Text style={styles.gameOptionTitle}>Crypto Trading</Text>
          <Text style={styles.gameOptionReward}>€500-2,000</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
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
    marginBottom: 40,
  },
  gameSelection: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  gameOption: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  gameOptionIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  gameOptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  gameOptionReward: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  miniGameContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  gameInstructions: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  timeline: {
    height: 120,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timelineText: {
    color: '#FFF',
    fontSize: 16,
  },
  videoClip: {
    position: 'absolute',
    width: 80,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  renderButton: {
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  renderButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webpage: {
    backgroundColor: '#FFF',
    minHeight: 300,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  webpageText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  webpageContent: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
  },
  webElement: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  webTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  webButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  webButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webElements: {
    gap: 10,
  },
  webElementButton: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  webElementText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cryptoChart: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 200,
    justifyContent: 'center',
  },
  cryptoPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  positionText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  cryptoButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cryptoButton: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  sellButton: {
    backgroundColor: '#F44336',
  },
  cryptoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});