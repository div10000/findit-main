import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#F5F5F5' }}>
      <TextInput placeholder="Search items..." style={{ borderWidth: 1, padding: 10, borderRadius: 18, marginBottom: 20, marginRight:34}} />
      <Button title="Report Lost Item" color="#4CAF50" onPress={() => router.push('/report')} />
      <Text style={{ marginBottom: 20 }}></Text>
      <Button title="Report Found Item" color="#2196F3" onPress={() => router.push('/report')} />
      <Feather name="user" size={34} color="red" onPress={() => router.push('/profile')} style={{ position: 'absolute', top: 20, right: 15,}} />
      <Text style={{ marginBottom: 20 }}></Text>
      <Button title="Logout" color='#CE5A67' onPress={() => router.push('/login')} />
    </View>
  );
}
