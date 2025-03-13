// Updated Profile page with profile picture upload and Dashboard with user profile picture

// app/profile.tsx
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { getAuth, updateProfile } from 'firebase/auth';

export default function Profile() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpdateProfile = () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            updateProfile(user, {
                displayName: name,
                photoURL: image,
            })
                .then(() => {
                    Alert.alert('Success', 'Profile updated successfully');
                    router.push('/dashboard');
                })
                .catch((error) => {
                    Alert.alert('Error', error.message);
                });
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <TouchableOpacity onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }} />
                ) : (
                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                        <Text>+ Add Photo</Text>
                    </View>
                )}
            </TouchableOpacity>
            <Text>Name</Text>
            <TextInput 
                style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} 
                value={name}
                onChangeText={setName}
            />
            <Text>Email</Text>
            <TextInput 
                style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} 
                value={email}
                onChangeText={setEmail}
                editable={false} // Email should not be editable
            />
            <Button title="Update Profile" color="#4CAF50" onPress={handleUpdateProfile} />
            <Text style={{ marginTop: 10 }}></Text>
            <Button title="Logout" color='#CE5A67' onPress={() => router.push('/login')} />
        </View>
    );
}