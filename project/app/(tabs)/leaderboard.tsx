import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { database } from '@/lib/database';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Medal, Award, DollarSign } from 'lucide-react-native';

interface LeaderboardEntry {
  username: string;
  cash: number;
  level: number;
  xp: number;
}

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await database.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const formatCash = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy color="#FFD700" size={24} />;
      case 2:
        return <Medal color="#C0C0C0" size={24} />;
      case 3:
        return <Award color="#CD7F32" size={24} />;
      default:
        return (
          <View style={styles.rankNumber}>
            <Text style={styles.rankNumberText}>{rank}</Text>
          </View>
        );
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return styles.firstPlace;
      case 2:
        return styles.secondPlace;
      case 3:
        return styles.thirdPlace;
      default:
        return styles.defaultPlace;
    }
  };

  return (
    <LinearGradient colors={['#0f0f23', '#1a1a2e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 LEADERBOARD</Text>
        <Text style={styles.subtitle}>Top Entrepreneurs</Text>
      </View>

      <ScrollView
        style={styles.leaderboardList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {leaderboard.length === 0 ? (
          <View style={styles.emptyState}>
            <Trophy color="#666" size={64} />
            <Text style={styles.emptyText}>No players yet</Text>
            <Text style={styles.emptySubtext}>Be the first to make it to the top!</Text>
          </View>
        ) : (
          leaderboard.map((entry, index) => {
            const rank = index + 1;
            return (
              <View key={entry.username} style={[styles.leaderboardItem, getRankStyle(rank)]}>
                <View style={styles.rankContainer}>
                  {getRankIcon(rank)}
                </View>

                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{entry.username}</Text>
                  <View style={styles.playerStats}>
                    <View style={styles.statItem}>
                      <DollarSign color="#FFD700" size={16} />
                      <Text style={styles.statText}>{formatCash(entry.cash)}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.levelText}>Level {entry.level}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cashContainer}>
                  <Text style={styles.cashAmount}>{formatCash(entry.cash)}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Rankings update in real-time
        </Text>
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
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#AAA',
    textAlign: 'center',
  },
  leaderboardList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
  },
  firstPlace: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  secondPlace: {
    borderColor: '#C0C0C0',
    backgroundColor: 'rgba(192, 192, 192, 0.1)',
  },
  thirdPlace: {
    borderColor: '#CD7F32',
    backgroundColor: 'rgba(205, 127, 50, 0.1)',
  },
  defaultPlace: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  playerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  levelText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  cashContainer: {
    alignItems: 'flex-end',
  },
  cashAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});