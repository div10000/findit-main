import { View, Text, TextInput, Button } from 'react-native';

export default function Report() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ marginBottom: 8 }}>Item Description</Text>
      <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
      <Text style={{ marginBottom: 8 }}>Contact Information</Text>
      <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
      <Button title="Submit Report" color="#4CAF50" onPress={() => {}} />
    </View>
  );
}