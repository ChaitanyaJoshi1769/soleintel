import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import RootNavigator from './navigation/RootNavigator';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize any async operations here
      // Then hide the splash screen
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    // Listen for notifications
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
      // Handle notification tap
    });

    return () => subscription.remove();
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
