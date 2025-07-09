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

const getCharacterEmoji = (characterId: string) => {
  const characterEmojis: { [key: string]: string } = {
    businessman: '🤵‍♂️',
    entrepreneur: '👨‍💼',
    luxury_woman: '👩‍💼',
    crypto_trader: '🧑‍💻',
    fashion_mogul: '👗',
    real_estate: '🏢',
  };
  return characterEmojis[characterId] || '🚶‍♂️';
};

const { width, height } = Dimensions.get('window');