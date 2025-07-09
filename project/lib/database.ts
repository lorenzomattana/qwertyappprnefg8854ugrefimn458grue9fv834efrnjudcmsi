// Built-in secure database system
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLogin: string;
}

export interface GameData {
  userId: string;
  cash: number;
  xp: number;
  level: number;
  currentCity: string;
  unlockedCars: string[];
  currentCar: string;
  completedJobs: number;
  position: { x: number; y: number; z: number };
  properties: string[];
  achievements: string[];
  stats: {
    totalEarnings: number;
    jobsCompleted: number;
    citiesVisited: number;
    carsOwned: number;
  };
}

class SecureDatabase {
  private static instance: SecureDatabase;
  private readonly USERS_KEY = '@millionaire_users';
  private readonly GAME_DATA_KEY = '@millionaire_game_data';
  private readonly SESSION_KEY = '@millionaire_session';

  static getInstance(): SecureDatabase {
    if (!SecureDatabase.instance) {
      SecureDatabase.instance = new SecureDatabase();
    }
    return SecureDatabase.instance;
  }

  // Simple hash function for passwords (in production, use bcrypt)
  private hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // User Management
  async createUser(username: string, email: string, password: string): Promise<User> {
    const users = await this.getAllUsers();
    
    // Check if user already exists
    if (users.find(u => u.username === username || u.email === email)) {
      throw new Error('User already exists');
    }

    const user: User = {
      id: this.generateId(),
      username,
      email,
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    users.push(user);
    await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    // Create initial game data
    await this.createGameData(user.id);
    
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User> {
    const users = await this.getAllUsers();
    const user = users.find(u => u.username === username);
    
    if (!user || user.passwordHash !== this.hashPassword(password)) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    // Create session
    await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify({ userId: user.id, loginTime: Date.now() }));
    
    return user;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await AsyncStorage.getItem(this.SESSION_KEY);
      if (!session) return null;
      
      const { userId } = JSON.parse(session);
      const users = await this.getAllUsers();
      return users.find(u => u.id === userId) || null;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.SESSION_KEY);
  }

  private async getAllUsers(): Promise<User[]> {
    try {
      const users = await AsyncStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  // Game Data Management
  async createGameData(userId: string): Promise<GameData> {
    const gameData: GameData = {
      userId,
      cash: 5000,
      xp: 0,
      level: 1,
      currentCity: 'dubai',
      unlockedCars: ['basic'],
      currentCar: 'basic',
      completedJobs: 0,
      position: { x: 0, y: 0, z: 0 },
      properties: [],
      achievements: [],
      stats: {
        totalEarnings: 5000,
        jobsCompleted: 0,
        citiesVisited: 1,
        carsOwned: 1
      }
    };

    await this.saveGameData(gameData);
    return gameData;
  }

  async getGameData(userId: string): Promise<GameData | null> {
    try {
      const data = await AsyncStorage.getItem(`${this.GAME_DATA_KEY}_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async saveGameData(gameData: GameData): Promise<void> {
    await AsyncStorage.setItem(`${this.GAME_DATA_KEY}_${gameData.userId}`, JSON.stringify(gameData));
  }

  async updateGameData(userId: string, updates: Partial<GameData>): Promise<GameData> {
    const currentData = await this.getGameData(userId);
    if (!currentData) throw new Error('Game data not found');
    
    const updatedData = { ...currentData, ...updates };
    await this.saveGameData(updatedData);
    return updatedData;
  }

  // Leaderboard
  async getLeaderboard(): Promise<Array<{ username: string; cash: number; level: number; xp: number }>> {
    const users = await this.getAllUsers();
    const leaderboard = [];
    
    for (const user of users) {
      const gameData = await this.getGameData(user.id);
      if (gameData) {
        leaderboard.push({
          username: user.username,
          cash: gameData.cash,
          level: gameData.level,
          xp: gameData.xp
        });
      }
    }
    
    return leaderboard.sort((a, b) => b.cash - a.cash);
  }
}

export const database = SecureDatabase.getInstance();