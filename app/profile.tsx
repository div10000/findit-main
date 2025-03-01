// Updated Profile page with profile picture upload and Dashboard with user profile picture

// app/profile.tsx
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

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
      <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
      <Text>Email</Text>
      <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }} />
      <Button title="Update Profile" color="#4CAF50" onPress={() => {}} />
      <Text style={{marginTop:10}}></Text>
      <Button title="Logout" color='#CE5A67' onPress={() => router.push('/login')} />
    </View>
  );
}