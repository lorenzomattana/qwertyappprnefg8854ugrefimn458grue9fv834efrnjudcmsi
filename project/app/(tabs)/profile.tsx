import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { database, GameData, User } from '@/lib/database';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, User as UserIcon, Trophy, DollarSign, Car, MapPin, Briefcase, Calendar } from 'lucide-react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);

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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await database.logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const formatCash = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user || !gameData) return null;

  return (
    <LinearGradient colors={['#0f0f23', '#1a1a2e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 PROFILE</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#FF4444" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <UserIcon color="#FFD700" size={48} />
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.levelBadge}>
            <Trophy color="#FFD700" size={16} />
            <Text style={styles.levelText}>Level {gameData.level}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <DollarSign color="#FFD700" size={24} />
            <Text style={styles.statValue}>{formatCash(gameData.cash)}</Text>
            <Text style={styles.statLabel}>Current Cash</Text>
          </View>

          <View style={styles.statCard}>
            <Trophy color="#4CAF50" size={24} />
            <Text style={styles.statValue}>{gameData.xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>

          <View style={styles.statCard}>
            <Briefcase color="#2196F3" size={24} />
            <Text style={styles.statValue}>{gameData.completedJobs}</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>

          <View style={styles.statCard}>
            <Car color="#FF9800" size={24} />
            <Text style={styles.statValue}>{gameData.unlockedCars.length}</Text>
            <Text style={styles.statLabel}>Cars Owned</Text>
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Game Statistics</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <DollarSign color="#FFD700" size={20} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Total Earnings</Text>
              <Text style={styles.detailValue}>{formatCash(gameData.stats.totalEarnings)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MapPin color="#4CAF50" size={20} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Cities Visited</Text>
              <Text style={styles.detailValue}>{gameData.stats.citiesVisited}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Car color="#FF9800" size={20} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Current Vehicle</Text>
              <Text style={styles.detailValue}>{gameData.currentCar}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MapPin color="#2196F3" size={20} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Current City</Text>
              <Text style={styles.detailValue}>{gameData.currentCity}</Text>
            </View>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.accountCard}>
          <Text style={styles.accountTitle}>Account Information</Text>
          
          <View style={styles.accountRow}>
            <Calendar color="#666" size={20} />
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>Member Since</Text>
              <Text style={styles.accountValue}>{formatDate(user.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.accountRow}>
            <UserIcon color="#666" size={20} />
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>Last Login</Text>
              <Text style={styles.accountValue}>{formatDate(user.lastLogin)}</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  logoutButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 15,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  accountCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountInfo: {
    marginLeft: 15,
  },
  accountLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  accountValue: {
    fontSize: 16,
    color: '#FFF',
  },
});