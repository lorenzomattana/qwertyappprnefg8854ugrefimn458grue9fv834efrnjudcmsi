import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '@/types/GameState';

const GAME_STATE_KEY = '@millionaire_game_state';

export const saveGameState = async (gameState: GameState): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(gameState);
    await AsyncStorage.setItem(GAME_STATE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving game state:', error);
    throw error;
  }
};

export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(GAME_STATE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

export const clearGameState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
    throw error;
  }
};