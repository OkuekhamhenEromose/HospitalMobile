// App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { warmServer } from './src/utils/KeepAlive';

export default function App() {
  useEffect(() => {
    // Fire-and-forget — silently wakes the Render backend the instant the
    // app mounts so the server is fully warm by the time the user fills in
    // their credentials and taps Login or Register.
    // Any network error is caught inside warmServer() and never surfaces here.
    warmServer();
  }, []); // empty deps → runs once on cold app launch only

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}