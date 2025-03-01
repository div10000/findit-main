import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Signup() {
    const router = useRouter();
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 15, backgroundColor: '#DCD7C9' }}>
            <Text style={{
                fontSize: 50,
                fontWeight: 'bold',
                color: '#4CAF50',
                textAlign: 'center',
                marginBottom: 10,
            }}>🔎FindIt🔍</Text>
            <Text style={{
                position: 'relative',
                textAlign: 'center',
                fontSize: 18,
                color: '#333333',
            }}>Sign Up to Continue !</Text>
            <Text style={{ marginBottom: 8 }}>Name</Text>
            <TextInput placeholder='Name Here...' style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8, }} />
            <Text style={{ marginBottom: 8 }}>Email</Text>
            <TextInput placeholder='Email Here...' style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8, }} />
            <Text style={{ marginBottom: 8 }}>Password</Text>
            <TextInput secureTextEntry style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
            <Button title="Sign Up" color="#2196F3" onPress={() => router.push('/')} />
            <Text style={{ marginTop: 30, marginBottom: 10, textAlign: 'center' }}>Already Have an Account ?</Text>
            <Button title="Login" color="#4CAF50" onPress={() => router.push('/login')} />
        </View>
    )
}