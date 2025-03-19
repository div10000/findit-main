import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function MyItems() {
  const [items, setItems] = useState<{ id: string; object: string; description: string; status: string; imageUrl?: string }[]>([]);
  const [loading, setLoading] = useState(true);

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
            <View style={{ backgroundColor: "#fff", padding: 16, marginBottom: 10, borderRadius: 8 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.object}</Text>
              <Text style={{ color: "#666" }}>{item.description}</Text>
              <Text style={{ fontStyle: "italic" }}>Status: {item.status}</Text>
              {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={{ width: 100, height: 100, marginTop: 10 }} />}
            </View>
          )}
        />
      )}
    </View>
  );
}
