import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Product {
  id?: string;
  sku?: string;
  upc?: string;
  title: string;
  brand: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  url: string;
}

interface PriceComparison {
  retailer: string;
  price: number;
  salePrice?: number;
  shipping?: number;
  url: string;
  inStock: boolean;
}

interface ExtensionStore {
  // State
  currentProduct: Product | null;
  priceComparisons: PriceComparison[];
  loading: boolean;
  error: string | null;
  watchlist: Product[];

  // Actions
  setCurrentProduct: (product: Product | null) => void;
  setPriceComparisons: (comparisons: PriceComparison[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToWatchlist: (product: Product) => void;
  removeFromWatchlist: (productId: string) => void;
  clearStore: () => void;
}

export const useStore = create<ExtensionStore>()(
  devtools(
    persist(
      (set) => ({
        currentProduct: null,
        priceComparisons: [],
        loading: false,
        error: null,
        watchlist: [],

        setCurrentProduct: (product) => set({ currentProduct: product }),
        setPriceComparisons: (comparisons) => set({ priceComparisons: comparisons }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        addToWatchlist: (product) =>
          set((state) => {
            const exists = state.watchlist.some((p) => p.sku === product.sku);
            if (exists) return state;
            return { watchlist: [...state.watchlist, product] };
          }),

        removeFromWatchlist: (productId) =>
          set((state) => ({
            watchlist: state.watchlist.filter((p) => p.sku !== productId),
          })),

        clearStore: () =>
          set({
            currentProduct: null,
            priceComparisons: [],
            loading: false,
            error: null,
          }),
      }),
      {
        name: 'soleintel-store',
      },
    ),
  ),
);
