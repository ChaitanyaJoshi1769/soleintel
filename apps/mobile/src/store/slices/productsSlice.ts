import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  currentPrice: number;
  lowestPrice?: number;
  highestPrice?: number;
  imageUrl?: string;
  inWatchlist: boolean;
}

interface ProductsState {
  searchResults: Product[];
  currentProduct: Product | null;
  categoryProducts: Product[];
  trendingProducts: Product[];
  loading: boolean;
  error: string | null;
  lastSearchQuery: string | null;
}

const initialState: ProductsState = {
  searchResults: [],
  currentProduct: null,
  categoryProducts: [],
  trendingProducts: [],
  loading: false,
  error: null,
  lastSearchQuery: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<{ products: Product[]; query: string }>) => {
      state.searchResults = action.payload.products;
      state.lastSearchQuery = action.payload.query;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    setCategoryProducts: (state, action: PayloadAction<Product[]>) => {
      state.categoryProducts = action.payload;
    },
    setTrendingProducts: (state, action: PayloadAction<Product[]>) => {
      state.trendingProducts = action.payload;
    },
    updateProductInWatchlist: (state, action: PayloadAction<{ productId: string; inWatchlist: boolean }>) => {
      const updateProduct = (product: Product) => {
        if (product.id === action.payload.productId) {
          product.inWatchlist = action.payload.inWatchlist;
        }
      };

      state.searchResults.forEach(updateProduct);
      state.categoryProducts.forEach(updateProduct);
      state.trendingProducts.forEach(updateProduct);
      if (state.currentProduct?.id === action.payload.productId) {
        state.currentProduct.inWatchlist = action.payload.inWatchlist;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.lastSearchQuery = null;
    },
  },
});

export const {
  setSearchResults,
  setCurrentProduct,
  setCategoryProducts,
  setTrendingProducts,
  updateProductInWatchlist,
  setLoading,
  setError,
  clearSearch,
} = productsSlice.actions;

export default productsSlice.reducer;
