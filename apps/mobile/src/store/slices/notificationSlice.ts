import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'watchlist_summary' | 'upgrade' | 'info';
  timestamp: string;
  read: boolean;
  productId?: string;
  data?: Record<string, any>;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  pushNotificationsEnabled: boolean;
  pushToken?: string;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  pushNotificationsEnabled: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount++;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount--;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount--;
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    enablePushNotifications: (state, action: PayloadAction<string>) => {
      state.pushNotificationsEnabled = true;
      state.pushToken = action.payload;
    },
    disablePushNotifications: (state) => {
      state.pushNotificationsEnabled = false;
      state.pushToken = undefined;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  enablePushNotifications,
  disablePushNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
