import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { database, GameData } from '@/lib/database';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag, DollarSign, CreditCard, Zap, Crown, Star, Gift } from 'lucide-react-native';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  realPrice: number; // Real money price in EUR
  image: string;
  category: 'cash' | 'premium' | 'boost';
  bonus?: string;
  popular?: boolean;
}

export default function ShopScreen() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<'cash' | 'premium' | 'boost'>('cash');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await database.getCurrentUser();
    if (!currentUser) {
      router.replace('/(auth)/login');
      return;
    }
    
    setUser(currentUser);
    const userData = await database.getGameData(currentUser.id);
    if (userData) {
      setGameData(userData);
    }
  };

  const shopItems: ShopItem[] = [
    // Cash Packages
    {
      id: 'cash_starter',
      name: 'Starter Pack',
      description: '€50,000 in-game cash to kickstart your empire',
      price: 50000,
      realPrice: 4.99,
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'cash',
    },
    {
      id: 'cash_business',
      name: 'Business Pack',
      description: '€200,000 in-game cash for serious entrepreneurs',
      price: 200000,
      realPrice: 14.99,
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'cash',
      bonus: '+20% XP for 24h',
      popular: true,
    },
    {
      id: 'cash_millionaire',
      name: 'Millionaire Pack',
      description: '€1,000,000 in-game cash - become an instant millionaire',
      price: 1000000,
      realPrice: 49.99,
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'cash',
      bonus: '+50% XP for 48h',
    },
    {
      id: 'cash_tycoon',
      name: 'Tycoon Pack',
      description: '€5,000,000 in-game cash - ultimate wealth package',
      price: 5000000,
      realPrice: 99.99,
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'cash',
      bonus: '+100% XP for 7 days',
    },
    // Premium Items
    {
      id: 'premium_vip',
      name: 'VIP Membership',
      description: 'Exclusive access to VIP areas and premium vehicles',
      price: 0,
      realPrice: 9.99,
      image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'premium',
      bonus: 'Monthly benefits',
    },
    {
      id: 'premium_penthouse',
      name: 'Luxury Penthouse',
      description: 'Exclusive penthouse with city views and premium amenities',
      price: 0,
      realPrice: 24.99,
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'premium',
    },
    // Boosts
    {
      id: 'boost_2x_earnings',
      name: '2x Earnings Boost',
      description: 'Double your earnings from all activities for 24 hours',
      price: 0,
      realPrice: 2.99,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'boost',
    },
    {
      id: 'boost_instant_level',
      name: 'Instant Level Up',
      description: 'Instantly gain one level and unlock new opportunities',
      price: 0,
      realPrice: 4.99,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'boost',
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

  const formatRealPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handlePurchase = (item: ShopItem) => {
    Alert.alert(
      'Purchase Confirmation',
      `Are you sure you want to buy ${item.name} for ${formatRealPrice(item.realPrice)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Buy Now', 
          onPress: () => processPurchase(item)
        },
      ]
    );
  };

  const processPurchase = async (item: ShopItem) => {
    if (!user || !gameData) return;

    try {
      // In a real app, this would integrate with payment processing
      // For demo purposes, we'll simulate the purchase
      
      let updates: Partial<GameData> = {};
      
      if (item.category === 'cash') {
        updates.cash = gameData.cash + item.price;
        updates.stats = {
          ...gameData.stats,
          totalEarnings: gameData.stats.totalEarnings + item.price
        };
      } else if (item.id === 'boost_instant_level') {
        updates.level = gameData.level + 1;
        updates.xp = gameData.xp + 1000;
      }

      if (Object.keys(updates).length > 0) {
        await database.updateGameData(user.id, updates);
        setGameData({ ...gameData, ...updates });
      }

      Alert.alert(
        'Purchase Successful!',
        `You have successfully purchased ${item.name}!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Purchase Failed', 'There was an error processing your purchase. Please try again.');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cash': return <DollarSign color="#FFD700" size={20} />;
      case 'premium': return <Crown color="#FFD700" size={20} />;
      case 'boost': return <Zap color="#FFD700" size={20} />;
      default: return <ShoppingBag color="#FFD700" size={20} />;
    }
  };

  const filteredItems = shopItems.filter(item => item.category === selectedCategory);

  if (!gameData) return null;

  return (
    <LinearGradient colors={['#0f0f23', '#1a1a2e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ PREMIUM SHOP</Text>
        <Text style={styles.subtitle}>Enhance Your Empire</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'cash' && styles.activeTab]}
          onPress={() => setSelectedCategory('cash')}
        >
          <DollarSign color={selectedCategory === 'cash' ? '#000' : '#FFD700'} size={20} />
          <Text style={[styles.categoryText, selectedCategory === 'cash' && styles.activeCategoryText]}>
            Cash
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'premium' && styles.activeTab]}
          onPress={() => setSelectedCategory('premium')}
        >
          <Crown color={selectedCategory === 'premium' ? '#000' : '#FFD700'} size={20} />
          <Text style={[styles.categoryText, selectedCategory === 'premium' && styles.activeCategoryText]}>
            Premium
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'boost' && styles.activeTab]}
          onPress={() => setSelectedCategory('boost')}
        >
          <Zap color={selectedCategory === 'boost' ? '#000' : '#FFD700'} size={20} />
          <Text style={[styles.categoryText, selectedCategory === 'boost' && styles.activeCategoryText]}>
            Boosts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Shop Items */}
      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            {item.popular && (
              <View style={styles.popularBadge}>
                <Star color="#FFD700" size={16} />
                <Text style={styles.popularText}>POPULAR</Text>
              </View>
            )}
            
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            
            <View style={styles.itemContent}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                
                {item.bonus && (
                  <View style={styles.bonusContainer}>
                    <Gift color="#4CAF50" size={16} />
                    <Text style={styles.bonusText}>{item.bonus}</Text>
                  </View>
                )}
                
                <View style={styles.priceContainer}>
                  {item.category === 'cash' && (
                    <Text style={styles.gamePrice}>+{formatPrice(item.price)}</Text>
                  )}
                  <Text style={styles.realPrice}>{formatRealPrice(item.realPrice)}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={() => handlePurchase(item)}
              >
                <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.purchaseGradient}>
                  <CreditCard color="#000" size={20} />
                  <Text style={styles.purchaseText}>BUY NOW</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Current Balance */}
      <View style={styles.balanceFooter}>
        <View style={styles.balanceContainer}>
          <DollarSign color="#FFD700" size={20} />
          <Text style={styles.balanceText}>Current Balance: {formatPrice(gameData.cash)}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: 'Orbitron-Bold',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#AAA',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  categoryText: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  activeCategoryText: {
    color: '#000',
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 1,
  },
  popularText: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  itemContent: {
    padding: 20,
  },
  itemInfo: {
    marginBottom: 20,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    color: '#AAA',
    fontFamily: 'Inter-Medium',
    lineHeight: 22,
    marginBottom: 12,
  },
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  bonusText: {
    color: '#4CAF50',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gamePrice: {
    fontSize: 18,
    color: '#4CAF50',
    fontFamily: 'Inter-Bold',
  },
  realPrice: {
    fontSize: 24,
    color: '#FFD700',
    fontFamily: 'Inter-Bold',
  },
  purchaseButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  purchaseGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  purchaseText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
    letterSpacing: 1,
  },
  balanceFooter: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.3)',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    borderRadius: 15,
  },
  balanceText: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
});