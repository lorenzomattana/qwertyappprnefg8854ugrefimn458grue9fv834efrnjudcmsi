export interface GameData {
  userId: string;
  cash: number;
  xp: number;
  level: number;
  currentCity: string;
  unlockedCars: string[];
  currentCar: string;
  currentCharacter: string;
  unlockedCharacters: string[];
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

  async createGameData(userId: string): Promise<GameData> {
    const gameData: GameData = {
      userId,
      cash: 5000,
      xp: 0,
      level: 1,
      currentCity: 'dubai',
      unlockedCars: ['basic'],
      currentCar: 'basic',
      currentCharacter: 'businessman',
      unlockedCharacters: ['businessman', 'entrepreneur', 'luxury_woman'],
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