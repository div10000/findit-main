import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import necessary functions
import '../firebaseConfig'; // Import the Firebase configuration

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        const auth = getAuth(); // Get the auth instance
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up successfully
                const user = userCredential.user;
                Alert.alert('Success', 'Account created successfully');
                router.push('/dashboard');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert('Error', errorMessage);
            });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 15, backgroundColor: '#F5F5F5' }}>
            <Text style={{
                fontSize: 50,
                fontWeight: 'bold',
                color: '#3E4A89',
                textAlign: 'center',
                marginBottom: 10,
            }}>🔎FindIt🔍</Text>
            <Text style={{
                position: 'relative',
                textAlign: 'center',
                fontSize: 18,
                color: '#333333',
            }}>Sign Up to Continue !</Text>
            <Text style={{ marginBottom: 8, color: '#3E4A89' }}>Name</Text>
            <TextInput 
                placeholder='Name Here...' 
                style={{ borderWidth: 1, borderColor: '#3E4A89', padding: 10, marginBottom: 16, borderRadius: 8, }} 
                value={name}
                onChangeText={setName}
            />
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
            <Button title="Sign Up" color="#3E4A89" onPress={handleSignup} />
            <Text style={{ marginTop: 30, marginBottom: 10, textAlign: 'center', color: '#3E4A89' }}>Already Have an Account ?</Text>
            <Button title="Login" color="#3E4A89" onPress={() => router.push('/login')} />
        </View>
    );
}