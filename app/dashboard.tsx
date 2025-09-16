import { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function Dashboard() {
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    // Fetch all items from Firestore
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'lostItems'));
                const data: any[] = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });
                setItems(data);
                setFilteredItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);

    // Filter items on search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredItems(items);
        } else {
            const filtered = items.filter((item) =>
                item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.place?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredItems(filtered);
        }
    }, [searchQuery, items]);

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#F5F5F5' }}>
            {/* Search Bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TextInput 
                    placeholder="Search items..." 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={{ flex: 1, borderWidth: 1, borderColor: '#3E4A89', padding: 10, borderRadius: 18, marginRight: 10 }} 
                />
            </View>

            {/* Search Results */}
            {searchQuery.length > 0 && (
                <ScrollView style={{ maxHeight: 250, marginBottom: 20 }}>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <TouchableOpacity 
                                key={item.id} 
                                onPress={() => setSelectedItem(item)}
                                style={{ backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, elevation: 2 }}
                            >
                                {item.imageUrl && (
                                    <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 8 }} />
                                )}
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                                <Text numberOfLines={2}>{item.description}</Text>
                                <Text style={{ fontStyle: 'italic', color: '#555' }}>Place: {item.place}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', color: '#777' }}>No matching items found</Text>
                    )}
                </ScrollView>
            )}

            {/* Item Detail Modal */}
            <Modal
                visible={!!selectedItem}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedItem(null)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
                        {selectedItem?.imageUrl && (
                            <Image source={{ uri: selectedItem.imageUrl }} style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 10 }} />
                        )}
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>{selectedItem?.name}</Text>
                        <Text style={{ marginBottom: 5 }}>{selectedItem?.description}</Text>
                        <Text style={{ fontStyle: 'italic', color: '#333', marginBottom: 5 }}>Place: {selectedItem?.place}</Text>
                        <Text>Status: {selectedItem?.status}</Text>
                        {selectedItem?.message && (
                            <Text style={{ marginTop: 10, fontStyle: 'italic', color: '#555' }}>Message: {selectedItem?.message}</Text>
                        )}

                        <TouchableOpacity 
                            onPress={() => setSelectedItem(null)} 
                            style={{ marginTop: 15, padding: 12, backgroundColor: '#2196F3', borderRadius: 8 }}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ScrollView>
                <TouchableOpacity 
                    style={{ backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, marginBottom: 20 }} 
                    onPress={() => router.push('/report')}
                >
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>Report Item</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{ backgroundColor: '#2196F3', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} 
                    onPress={() => router.push('/myitems')}
                >
                    <Feather name="list" size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>My Items</Text>
                </TouchableOpacity>

                {/* New Messages Button */}
                <TouchableOpacity 
                    style={{ backgroundColor: '#9C27B0', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} 
                    onPress={() => router.push('/messages')}
                >
                    <Feather name="message-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Messages</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{ backgroundColor: '#FF9800', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} 
                    onPress={() => router.push('/profile')}
                >
                    <Feather name="user" size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>View Profile</Text>
                </TouchableOpacity>

                {/* Logout */}
                <TouchableOpacity 
                    style={{ backgroundColor: '#CE5A67', padding: 15, borderRadius: 10 }} 
                    onPress={() => {
                        auth.signOut().then(() => {
                            router.replace('/login'); // Prevent going back to Dashboard
                        });
                    }}
                >
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
