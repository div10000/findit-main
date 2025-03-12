import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import '../firebaseConfig'; // Import the Firebase configuration

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const auth = getAuth(); // Get the auth instance
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Logged in successfully
                const user = userCredential.user;
                router.push('/dashboard');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    Alert.alert('Error', 'Incorrect password');
                } else if (errorCode === 'auth/user-not-found') {
                    Alert.alert('Error', 'No user found');
                } else {
                    Alert.alert('Error', errorMessage);
                }
            });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#F5F5F5' }}>
            <Text style={{
                fontSize: 60,
                fontWeight: 'bold',
                color: '#3E4A89',
                textAlign: 'center',
                marginBottom: 10,
            }}>🔎FindIt🔍</Text>
            <Text style={{
                position: 'relative',
                textAlign: 'center',
                fontSize: 20,
                color: '#333333',
            }}>Login to Continue !</Text>
            <Text style={{ marginBottom: 8, color: '#3E4A89' }}>Email</Text>
            <TextInput 
                placeholder='Email Here...' 
                style={{ borderWidth: 1, borderColor: '#3E4A89', padding: 10, marginBottom: 16, borderRadius: 8, }} 
                value={email}
                onChangeText={setEmail}
            />
            <Text style={{ marginBottom: 8, color: '#3E4A89' }}>Password</Text>
            <TextInput 
                secureTextEntry 
                style={{ borderWidth: 1, borderColor: '#3E4A89', padding: 10, marginBottom: 16, borderRadius: 8 }} 
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" color="#3E4A89" onPress={handleLogin} />
            <Text style={{ marginTop: 30, marginBottom: 10, textAlign: 'center', color: '#3E4A89' }}>Don't Have an Account ?</Text>
            <Button title="Sign Up" color="#3E4A89" onPress={() => router.push('/signup')} />
        </View>
    );
}