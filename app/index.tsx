import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 40, backgroundColor: '#F5F5F5' }}>
      <TextInput placeholder="Search items..." style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 20 }} />
      <Button title="Report Lost Item" color="#4CAF50" onPress={() => router.push('/report')} />
      <Button title="Report Found Item" color="#2196F3" onPress={() => router.push('/report')} />
      <Feather name="user" size={24} color="red" onPress={() => router.push('/profile')} style={{ position: 'absolute', top: 40, right: 16,}} />
    </View>
  );
}
