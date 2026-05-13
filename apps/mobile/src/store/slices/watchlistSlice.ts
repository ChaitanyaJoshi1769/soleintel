import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WatchlistItem {
  id: string;
  productId: string;
  productTitle: string;
  brand: string;
  currentPrice: number;
  previousPrice?: number;
  targetPrice?: number;
  imageUrl?: string;
  alertCreated: boolean;
  savedAt: string;
}

interface WatchlistState {
  items: WatchlistItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  totalSavings: number;
}

const initialState: WatchlistState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null,
  totalSavings: 0,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setWatchlist: (state, action: PayloadAction<WatchlistItem[]>) => {
      state.items = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.totalSavings = action.payload.reduce((sum, item) => {
        const savings = (item.previousPrice || item.currentPrice) - item.currentPrice;
        return sum + (savings > 0 ? savings : 0);
      }, 0);
    },
    addToWatchlist: (state, action: PayloadAction<WatchlistItem>) => {
      state.items.push(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    updateWatchlistItem: (state, action: PayloadAction<WatchlistItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
  setLoading,
  setError,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;
