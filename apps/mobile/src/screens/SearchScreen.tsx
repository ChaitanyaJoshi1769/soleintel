import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setSearchResults, setLoading } from '../store/slices/productsSlice';
import { apiClient } from '../services/api';

export default function SearchScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState('');
  const { searchResults, loading } = useSelector((state: RootState) => state.products);

  const handleSearch = async () => {
    if (query.trim().length < 2) return;

    dispatch(setLoading(true));
    try {
      const results = await apiClient.searchProducts(query);
      dispatch(setSearchResults({ products: results, query }));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#999"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      ) : searchResults.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {query ? 'No results found' : 'Search for shoes to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
            >
              <View style={styles.resultContent}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultBrand}>{item.brand}</Text>
              </View>
              <Text style={styles.resultPrice}>${item.currentPrice}</Text>
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
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 14,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
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
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resultBrand: {
    fontSize: 12,
    color: '#999',
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
});
