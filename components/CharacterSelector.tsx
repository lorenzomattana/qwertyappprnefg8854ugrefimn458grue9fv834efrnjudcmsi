import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check } from 'lucide-react-native';

interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  unlocked: boolean;
  price?: number;
}

interface CharacterSelectorProps {
  currentCharacter: string;
  onSelectCharacter: (characterId: string) => void;
  onClose: () => void;
  userCash: number;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  currentCharacter,
  onSelectCharacter,
  onClose,
  userCash
}) => {
  const characters: Character[] = [
    {
      id: 'businessman',
      name: 'Business Executive',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Sharp suit, sharper mind',
      unlocked: true,
    },
    {
      id: 'entrepreneur',
      name: 'Tech Entrepreneur',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Innovation meets ambition',
      unlocked: true,
    },
    {
      id: 'luxury_woman',
      name: 'Luxury Lifestyle',
      image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Elegance and success',
      unlocked: true,
    },
    {
      id: 'crypto_trader',
      name: 'Crypto Trader',
      image: 'https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Digital fortune maker',
      unlocked: userCash >= 50000,
      price: 50000,
    },
    {
      id: 'fashion_mogul',
      name: 'Fashion Mogul',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Style and substance',
      unlocked: userCash >= 100000,
      price: 100000,
    },
    {
      id: 'real_estate',
      name: 'Real Estate Tycoon',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Property empire builder',
      unlocked: userCash >= 200000,
      price: 200000,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSelectCharacter = (character: Character) => {
    if (!character.unlocked) {
      return;
    }
    onSelectCharacter(character.id);
  };

  return (
    <LinearGradient colors={['#0f0f23', '#1a1a2e']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <ArrowLeft color="#FFD700" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>👤 CHARACTER</Text>
        <View style={styles.placeholder} />
      </View>

      <Text style={styles.subtitle}>Choose Your Avatar</Text>

      <ScrollView style={styles.characterList} showsVerticalScrollIndicator={false}>
        {characters.map((character) => (
          <TouchableOpacity
            key={character.id}
            style={[
              styles.characterCard,
              currentCharacter === character.id && styles.selectedCard,
              !character.unlocked && styles.lockedCard,
            ]}
            onPress={() => handleSelectCharacter(character)}
            disabled={!character.unlocked}
          >
            <Image source={{ uri: character.image }} style={styles.characterImage} />
            
            <View style={styles.characterInfo}>
              <Text style={[
                styles.characterName,
                currentCharacter === character.id && styles.selectedText
              ]}>
                {character.name}
              </Text>
              <Text style={styles.characterDescription}>
                {character.description}
              </Text>
              
              {character.price && (
                <Text style={[
                  styles.characterPrice,
                  !character.unlocked && styles.lockedPrice
                ]}>
                  {formatPrice(character.price)}
                </Text>
              )}
            </View>

            <View style={styles.characterStatus}>
              {currentCharacter === character.id ? (
                <View style={styles.selectedBadge}>
                  <Check color="#FFF" size={20} />
                </View>
              ) : character.unlocked ? (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>SELECT</Text>
                </View>
              ) : (
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedText}>LOCKED</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Unlock new characters as you progress in your entrepreneurial journey
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: 'Orbitron-Bold',
  },
  placeholder: {
    width: 44,
  },
  subtitle: {
    fontSize: 18,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Inter-Medium',
  },
  characterList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  characterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  selectedCard: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  lockedCard: {
    opacity: 0.6,
    borderColor: '#555',
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
    fontFamily: 'Inter-Bold',
  },
  selectedText: {
    color: '#4CAF50',
  },
  characterDescription: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  characterPrice: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  lockedPrice: {
    color: '#666',
  },
  characterStatus: {
    alignItems: 'center',
  },
  selectedBadge: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  availableText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  lockedBadge: {
    backgroundColor: '#666',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lockedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
});