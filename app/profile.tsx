import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getAuth, updateProfile, signOut } from 'firebase/auth';

export default function Profile() {
    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;

    const [image, setImage] = useState<string | null>(user?.photoURL || null);
    const [name, setName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
            setImage(user.photoURL || null);
        }
    }, [user]);

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

    const uploadImageToCloudinary = async (localUri: string) => {
        const data = new FormData();
        data.append("file", {
            uri: localUri,
            type: "image/jpeg",
            name: "profile.jpg",
        } as any);
        data.append("upload_preset", "findit_profiles"); // ✅ unsigned preset

        try {
            setUploading(true);
            let res = await fetch("https://api.cloudinary.com/v1_1/dmvwfunh9/image/upload", {
                method: "POST",
                body: data,
            });
            let result = await res.json();
            setUploading(false);
            if (result.secure_url) {
                return result.secure_url;
            } else {
                throw new Error("Upload failed");
            }
        } catch (err) {
            setUploading(false);
            Alert.alert("Error", "Image upload failed");
            return null;
        }
    };

    const handleUpdateProfile = async () => {
        if (!user) return;
        let uploadedUrl = image;

        // Upload to Cloudinary if new local image picked
        if (image && !image.startsWith("http")) {
            uploadedUrl = await uploadImageToCloudinary(image);
        }

        if (!uploadedUrl) return;

        updateProfile(user, { displayName: name, photoURL: uploadedUrl })
            .then(() => {
                Alert.alert('Success', 'Profile updated successfully');
                router.push('/dashboard');
            })
            .catch((error) => Alert.alert('Error', error.message));
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/login');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F5F5F5' }}>
            
            {/* Rewards icon (top-right) */}
            <TouchableOpacity
                onPress={() => router.push('/rewards')}
                style={{
                    position: 'absolute',
                    top: 40,
                    right: 20,
                    zIndex: 10,
                    backgroundColor: '#fff',
                    padding: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#eee',
                    elevation: 4,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text style={{ fontSize: 20 }}>🏆</Text>
            </TouchableOpacity>

            {/* Profile Picture + Name */}
            <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginBottom: 20 }}>
                {image ? (
                    <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#4CAF50' }} />
                ) : (
                    <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#bbb' }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>+ Add Photo</Text>
                    </View>
                )}
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10 }}>{name || 'Your Name'}</Text>
            </TouchableOpacity>

            {/* Name Input */}
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' }}>Name</Text>
            <TextInput 
                style={{ width: '100%', borderWidth: 1, borderColor: '#4CAF50', padding: 12, marginBottom: 16, borderRadius: 8, backgroundColor: '#fff' }} 
                value={name}
                onChangeText={setName}
            />

            {/* Email Input (Disabled) */}
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' }}>Email</Text>
            <TextInput 
                style={{ width: '100%', borderWidth: 1, borderColor: '#999', padding: 12, marginBottom: 20, borderRadius: 8, backgroundColor: '#E0E0E0' }} 
                value={email}
                editable={false} 
            />

            {/* Update Profile Button */}
            <TouchableOpacity onPress={handleUpdateProfile} disabled={uploading} style={{ backgroundColor: uploading ? "#999" : "#4CAF50", padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    {uploading ? "Uploading..." : "Update Profile"}
                </Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: "#CE5A67", padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Logout</Text>
            </TouchableOpacity>
            
        </View>
    );
}
