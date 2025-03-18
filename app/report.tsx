import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";  
import * as ImagePicker from 'expo-image-picker';

export default function Report() {
    const [object, setObject] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [status, setStatus] = useState('I lost it😥');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) setUserId(user.uid);
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };

    const uploadImageToCloudinary = async (uri: string) => {
        const data = new FormData();
        data.append("file", {
            uri,
            type: "image/jpeg",
            name: "upload.jpg",
        } as any);  // Type assertion for FormData issue

        data.append("upload_preset", "findit1");  
        data.append("cloud_name", "dmvwfunh9");

        try {
            let response = await fetch(`https://api.cloudinary.com/v1_1/dmvwfunh9/image/upload`, {
                method: "POST",
                body: data,
            });

            let result = await response.json();
            return result.secure_url;  // Cloudinary's final image URL
        } catch (error) {
            console.error("Cloudinary upload error:", error);
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
            let uploadedImageUrl = imageUrl ? await uploadImageToCloudinary(imageUrl) : null;

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
