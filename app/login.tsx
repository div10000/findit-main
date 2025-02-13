import { View, Text, TextInput, Button } from 'react-native';

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: 'center',  padding:  }}>
        <Text style={{
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom:10,
  }}>FindIt</Text>
        <Text style={{
    position: 'relative',
    textAlign: 'center',
    fontSize: 18,
    color: '#333333',
  }}>Login to Continue !</Text>
      <Text style={{ marginBottom: 8 }}>Email</Text>
      <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
      <Text style={{ marginBottom: 8 }}>Password</Text>
      <TextInput secureTextEntry style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
      <Button title="Login" color="#4CAF50" onPress={() => {}} />
      <Button title="Sign Up" color="#2196F3" onPress={() => {}} />
    </View>
  );
}