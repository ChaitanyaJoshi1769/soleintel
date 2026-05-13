import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setWatchlist, setLoading } from '../store/slices/watchlistSlice';
import { apiClient } from '../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, totalSavings } = useSelector((state: RootState) => state.watchlist);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    dispatch(setLoading(true));
    try {
      const watchlist = await apiClient.getWatchlist();
      dispatch(setWatchlist(watchlist));
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.name || 'User'}! 👟</Text>
        <Text style={styles.subtitle}>Track your favorite shoe prices</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#667eea' }]}>
          <Text style={styles.statValue}>{items.length}</Text>
          <Text style={styles.statLabel}>Watchlists</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#4ECDC4' }]}>
          <Text style={styles.statValue}>${totalSavings.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Potential Savings</Text>
        </View>
      </View>

      {/* Recent Price Drops */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Price Drops</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>📌 Add items to your watchlist to see price drops</Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.ctaButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.slice(0, 5).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.priceDropCard}
              onPress={() => navigation.navigate('ProductDetails', { productId: item.productId })}
            >
              <View style={styles.cardContent}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.productTitle}
                </Text>
                <Text style={styles.brand}>{item.brand}</Text>
              </View>
              <View style={styles.priceSection}>
                <Text style={styles.currentPrice}>${item.currentPrice}</Text>
                {item.previousPrice && (
                  <Text style={styles.previousPrice}>${item.previousPrice}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionLabel}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.actionIcon}>📁</Text>
            <Text style={styles.actionLabel}>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionLabel}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={fetchWatchlist}
          >
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionLabel}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Keep saving with SOLEINTEL 💰</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#667eea',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  priceDropCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: '#999',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
  previousPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
  },
});
