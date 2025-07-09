export interface GameState {
  cash: number;
  xp: number;
  currentCity: string;
  unlockedCars: string[];
  currentCar: string;
  completedJobs: number;
  position: { x: number; y: number; z: number };
}

export interface MiniGameResult {
  earnings: number;
  xpGained: number;
  success: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  price: number;
  speed: number;
  image: string;
  unlocked: boolean;
}

export interface City {
  id: string;
  name: string;
  cost: number;
  unlocked: boolean;
}