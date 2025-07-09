import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { database, GameData } from '@/lib/database';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, TrendingUp, Car, Plane, Trophy, DollarSign, Zap, Crown } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [user, setUser] = useState<any>(null);

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

  const formatCash = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!user || !gameData) return null;

  return (
    <LinearGradient colors={['#0f0f23', '#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(15, 15, 35, 0.9)', 'rgba(15, 15, 35, 1)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroContent}>
              <Text style={styles.greeting}>{getGreeting()}, {user.username}</Text>
              <Text style={styles.heroTitle}>MILLIONAIRE</Text>
              <Text style={styles.heroSubtitle}>ENTREPRENEUR</Text>
              <Text style={styles.heroTagline}>Build Your Empire, Live Your Dreams</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Dashboard */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.statGradient}>
                <DollarSign color="#000" size={24} />
                <Text style={styles.statValue}>{formatCash(gameData.cash)}</Text>
                <Text style={styles.statLabel}>Net Worth</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.statGradient}>
                <Crown color="#FFF" size={24} />
                <Text style={styles.statValueWhite}>Level {gameData.level}</Text>
                <Text style={styles.statLabelWhite}>Status</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.statGradient}>
                <Zap color="#FFF" size={24} />
                <Text style={styles.statValueWhite}>{gameData.xp}</Text>
                <Text style={styles.statLabelWhite}>Experience</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.statGradient}>
                <TrendingUp color="#FFF" size={24} />
                <Text style={styles.statValueWhite}>{gameData.completedJobs}</Text>
                <Text style={styles.statLabelWhite}>Jobs Done</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.primaryAction}
            onPress={() => router.push('/(tabs)/game')}
          >
            <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.primaryActionGradient}>
              <Play color="#000" size={32} />
              <View style={styles.actionContent}>
                <Text style={styles.primaryActionTitle}>START PLAYING</Text>
                <Text style={styles.primaryActionSubtitle}>Continue your journey to millions</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity 
              style={styles.secondaryAction}
              onPress={() => router.push('/(tabs)/garage')}
            >
              <LinearGradient colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 165, 0, 0.2)']} style={styles.secondaryActionGradient}>
                <Car color="#FFD700" size={24} />
                <Text style={styles.secondaryActionText}>Garage</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryAction}
              onPress={() => router.push('/(tabs)/travel')}
            >
              <LinearGradient colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 165, 0, 0.2)']} style={styles.secondaryActionGradient}>
                <Plane color="#FFD700" size={24} />
                <Text style={styles.secondaryActionText}>Travel</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryAction}
              onPress={() => router.push('/(tabs)/leaderboard')}
            >
              <LinearGradient colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 165, 0, 0.2)']} style={styles.secondaryActionGradient}>
                <Trophy color="#FFD700" size={24} />
                <Text style={styles.secondaryActionText}>Rankings</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Status */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Location</Text>
              <Text style={styles.statusValue}>{gameData.currentCity}</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Vehicle</Text>
              <Text style={styles.statusValue}>{gameData.currentCar}</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              💼 Completed {gameData.completedJobs} business deals
            </Text>
            <Text style={styles.activityText}>
              🏆 Reached Level {gameData.level}
            </Text>
            <Text style={styles.activityText}>
              💰 Earned {formatCash(gameData.stats.totalEarnings)} total
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.4,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 30,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#AAA',
    fontFamily: 'Inter-Medium',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: 'Orbitron-Black',
    letterSpacing: 3,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Orbitron-Bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 5,
  },
  heroTagline: {
    fontSize: 16,
    color: '#CCC',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  statsSection: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Inter-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statValueWhite: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Inter-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Inter-Medium',
    opacity: 0.8,
  },
  statLabelWhite: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    opacity: 0.9,
  },
  actionsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: 'Orbitron-Bold',
    marginBottom: 20,
    letterSpacing: 1,
  },
  primaryAction: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
  },
  actionContent: {
    marginLeft: 20,
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    width: '31%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  secondaryActionGradient: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  secondaryActionText: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
    textAlign: 'center',
  },
  statusSection: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 20,
  },
  statusLabel: {
    fontSize: 14,
    color: '#AAA',
    fontFamily: 'Inter-Medium',
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Inter-Bold',
    textTransform: 'capitalize',
  },
  activitySection: {
    padding: 20,
    paddingBottom: 40,
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    marginBottom: 10,
    lineHeight: 24,
  },
});