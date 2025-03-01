import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center',  padding:16, backgroundColor: '#DFD3C3' }}>
    <Text style={{
    fontSize: 60,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom:10,
  }}>🔎FindIt🔍</Text>
        <Text style={{
    position: 'relative',
    textAlign: 'center',
    fontSize: 20,
    color: '#333333',
  }}>Login to Continue !</Text>
      <Text style={{ marginBottom: 8 }}>Email</Text>
      <TextInput placeholder='Email Here...' style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8, }} />
      <Text style={{ marginBottom: 8 }}>Password</Text>
      <TextInput secureTextEntry style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
      <Button title="Login" color="#4CAF50" onPress={() => router.push('/')} />
        <Text style={{marginTop:30, marginBottom:10 ,textAlign:'center'}}>Don't Have an Account ?</Text>
      <Button title="Sign Up" color="#2196F3" onPress={() => router.push('/signup')} />

      {/* <Button title="Continue AS Guest" color="black" onPress={() => router.push('/')} /> */}
        

    </View>
  );
}