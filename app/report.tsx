import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";  // Firestore instance
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer'; // Needed for Expo image upload

export default function Report() {
    const [object, setObject] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userId, setUserId] = useState(''); // Assuming you have a way to get the user ID

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true, // Required for uploading to Firebase from Expo
        });

        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };

    const uploadImageToFirebase = async (uri: string) => {
        try {
            const storage = getStorage();
            const response = await fetch(uri);
            const blob = await response.blob();
            const imageRef = ref(storage, `lostItems/${Date.now()}.jpg`);

            await uploadBytes(imageRef, blob);
            return await getDownloadURL(imageRef);
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    const uploadItemData = async () => {
        try {
            let uploadedImageUrl = imageUrl ? await uploadImageToFirebase(imageUrl) : null;

            await addDoc(collection(db, "lostItems"), {
                object,
                description,
                place,
                imageUrl: uploadedImageUrl,
                userId,
                createdAt: new Date(),
            });

            Alert.alert("Success", "Item added successfully!");
            setObject('');
            setDescription('');
            setPlace('');
            setImageUrl(null);
        } catch (error: any) {
            Alert.alert("Error", "Error adding item: " + error.message);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#F5F5F5' }}>
            <Text style={{ marginBottom: 8, color: '#3E4A89' }}>Item Name</Text>
            <TextInput 
                style={{ borderWidth: 1, borderColor: '#3E4A89', padding: 10, marginBottom: 16, borderRadius: 8 }} 
                value={object}
                onChangeText={setObject}
            />
            <Text style={{ marginBottom: 8, color: '#3E4A89' }}>Description</Text>
            <TextInput 
                style={{ borderWidth: 1, borderColor: '#3E4A89', padding: 10, marginBottom: 16, borderRadius: 8 }} 
                value={description}
                onChangeText={setDescription}
            />
            <Text style={{ marginBottom: 8, color: '#3E4A89' }}>Place</Text>
            <TextInput 
                style={{ borderWidth: 1, borderColor: '#3E4A89', padding: 10, marginBottom: 16, borderRadius: 8 }} 
                value={place}
                onChangeText={setPlace}
            />
            <TouchableOpacity onPress={pickImage} style={{ marginBottom: 16 }}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100, borderRadius: 8 }} />
                ) : (
                    <View style={{ width: 100, height: 100, borderRadius: 8, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#3E4A89' }}>+ Add Photo</Text>
                    </View>
                )}
            </TouchableOpacity>
            <Button title="Submit Report" color="#4CAF50" onPress={uploadItemData} />
        </View>
    );
}
