import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useEffect } from 'react';

export default function Layout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (segments[0] !== 'login') {
      router.replace('/login');
    }
  }, [segments]);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <Slot />
      </View>
    </SafeAreaProvider>
  );
}