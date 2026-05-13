import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function WatchlistScreen({ navigation }: any) {
  const { items } = useSelector((state: RootState) => state.watchlist);

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No items in your watchlist yet</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', { productId: item.productId })}>
              <View>
                <Text style={styles.title}>{item.productTitle}</Text>
                <Text style={styles.brand}>{item.brand}</Text>
              </View>
              <Text style={styles.price}>${item.currentPrice}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
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
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  brand: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
});
