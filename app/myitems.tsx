import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

interface Item {
  id: string;
  object: string;
  description: string;
  status: string;
  message?: string;
  imageUrl?: string;
}

export default function MyItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      if (!auth.currentUser) return;
      const q = query(collection(db, "lostItems"), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const userItems = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          object: data.object,
          description: data.description,
          status: data.status,
          message: data.message || "No message provided.",
          imageUrl: data.imageUrl
        };
      });
      setItems(userItems);
      setLoading(false);
    };

    fetchItems();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" />;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F5F5F5" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>My Items</Text>
      {items.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#666" }}>No items found</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(item);
                setModalVisible(true);
              }}
              style={{ backgroundColor: "#fff", padding: 16, marginBottom: 10, borderRadius: 8 }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.object}</Text>
              <Text style={{ color: "#666" }}>{item.description}</Text>
              <Text style={{ fontStyle: "italic" }}>Status: {item.status}</Text>
              {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }} />}
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal to show item details */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
            {selectedItem && (
              <ScrollView>
                <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>{selectedItem.object}</Text>
                <Text style={{ fontSize: 16, color: "#333" }}>Description: {selectedItem.description}</Text>
                <Text style={{ fontSize: 16, fontStyle: "italic", marginVertical: 5 }}>Status: {selectedItem.status}</Text>
                <Text style={{ fontSize: 16, color: "#555", marginBottom: 10 }}>Message: {selectedItem.message}</Text>
                {selectedItem.imageUrl && <Image source={{ uri: selectedItem.imageUrl }} style={{ width: "100%", height: 200, borderRadius: 10 }} />}
              </ScrollView>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 15, alignSelf: "center" }}>
              <Text style={{ fontSize: 18, color: "#4CAF50" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
