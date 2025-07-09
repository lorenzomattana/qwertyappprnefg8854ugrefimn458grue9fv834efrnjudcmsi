interface GameHUDProps {
  cash: number;
  xp: number;
  level: number;
  currentCity: string;
  currentCar: string;
  currentCharacter?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ cash, xp, level, currentCity, currentCar, currentCharacter }) => {