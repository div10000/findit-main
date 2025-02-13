import { View, Text, TextInput, Button } from 'react-native';

export default function Profile() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ marginBottom: 8 }}>Name</Text>
      <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
      <Text style={{ marginBottom: 8 }}>Email</Text>
      <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
      <Button title="Update Profile" color="#4CAF50" onPress={() => {}} />
    </View>
  );
}