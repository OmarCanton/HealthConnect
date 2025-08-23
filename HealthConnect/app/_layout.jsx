import { Provider } from 'react-redux'
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '../redux/store'
import Toast from 'react-native-toast-message'
import { StatusBar } from 'expo-status-bar'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    useEffect(() => {
      const loadApp = async () => {
        await SplashScreen.hideAsync()
      }
      loadApp()
    }, [])

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar style='dark'/>
          <Stack screenOptions={{
            headerShown: false
          }}>
          {/* index for splash */}
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <Toast />
        </PersistGate>
      </Provider>
    )
}
