import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";  
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import * as ImagePicker from 'expo-image-picker';

export default function Report() {
    const [object, setObject] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [status, setStatus] = useState('I lost it😥');  // Default status
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Get the logged-in user ID
    useEffect(() => {
        const user = auth.currentUser;
        if (user) setUserId(user.uid);
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Updated line
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
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
        if (!object || !description || !place || !status) {
            Alert.alert("Error", "All fields (except image) must be filled!");
            return;
        }

        if (!userId) {
            Alert.alert("Error", "User not logged in!");
            return;
        }

        try {
            let uploadedImageUrl = imageUrl ? await uploadImageToFirebase(imageUrl) : null;

            await addDoc(collection(db, "lostItems"), {
                object,
                description,
                place,
                status,
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
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Fill Details</Text>

            <Text style={{ marginBottom: 8, color: '#3E4A89' }}>Status</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
                <TouchableOpacity 
                    style={{ backgroundColor: status === 'I lost it😥' ? '#FF5733' : '#ccc', padding: 10, borderRadius: 8 }}
                    onPress={() => setStatus('I lost it😥')}
                >
                    <Text style={{ color: '#FFF' }}>I lost it😥</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ backgroundColor: status === 'I found it🤨' ? '#4CAF50' : '#ccc', padding: 10, borderRadius: 8 }}
                    onPress={() => setStatus('I found it🤨')}
                >
                    <Text style={{ color: '#FFF' }}>I found it🤨</Text>
                </TouchableOpacity>
            </View>

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
            
            <View style={{ alignSelf: 'center' }}>
    <TouchableOpacity onPress={pickImage} style={{ marginBottom: 16 }}>
        {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100, borderRadius: 8 }} />
        ) : (
            <View style={{ width: 100, height: 100, borderRadius: 8, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#3E4A89' }}>+ Add Photo</Text>
            </View>
        )}
    </TouchableOpacity>
</View>


            <Button title="Submit Details" color="#4CAF50" onPress={uploadItemData} />
        </View>
    );
}