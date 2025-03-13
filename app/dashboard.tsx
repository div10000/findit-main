import { View, Text, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function Dashboard() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#F5F5F5' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TextInput 
                    placeholder="Search items..." 
                    style={{ flex: 1, borderWidth: 1, borderColor: '#3E4A89', padding: 10, borderRadius: 18, marginRight: 10 }} 
                />
                
            </View>
            <ScrollView>
                <TouchableOpacity 
                    style={{ backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, marginBottom: 20 }} 
                    onPress={() => router.push('/report')}
                >
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>Report Lost Item</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ backgroundColor: '#2196F3', padding: 15, borderRadius: 10, marginBottom: 20 }} 
                    onPress={() => router.push('/report')}
                >
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>Report Found Item</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ backgroundColor: '#FF9800', padding: 15, borderRadius: 10, marginBottom: 20 }} 
                    onPress={() => router.push('/profile')}
                >
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ backgroundColor: '#CE5A67', padding: 15, borderRadius: 10 }} 
                    onPress={() => router.push('/login')}
                >
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
            
        </View>
    );
}
