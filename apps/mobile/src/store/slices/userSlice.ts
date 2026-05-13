import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  tier: 'free' | 'pro' | 'premium';
  smsAlertsEnabled: boolean;
  biometricEnabled: boolean;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  lastLoginAt: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  lastLoginAt: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.lastLoginAt = new Date().toISOString();
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    enableBiometric: (state) => {
      if (state.user) {
        state.user.biometricEnabled = true;
      }
    },
    disableBiometric: (state) => {
      if (state.user) {
        state.user.biometricEnabled = false;
      }
    },
    toggleSMSAlerts: (state) => {
      if (state.user) {
        state.user.smsAlertsEnabled = !state.user.smsAlertsEnabled;
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
  setUser,
  updateUser,
  logout,
  enableBiometric,
  disableBiometric,
  toggleSMSAlerts,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
