import { configureStore } from '@reduxjs/toolkit';
import watchlistReducer from './slices/watchlistSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    user: userReducer,
    notifications: notificationReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
