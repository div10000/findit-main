import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useRouter } from "expo-router";

// Define Item Type
interface LostItem {
  id: string;
  userId: string;
  status: "I lost it😥" | "I found it🤨";
  object: string;
  place: string;
  description: string;
}

export default function Messages() {
  const [matchedItems, setMatchedItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (!auth.currentUser) return;

        const userId = auth.currentUser.uid;
        const userQuery = query(collection(db, "lostItems"), where("userId", "==", userId));
        const userSnapshot = await getDocs(userQuery);
        const userItems: LostItem[] = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LostItem));

        let matches: LostItem[] = [];

        for (let item of userItems) {
          const oppositeStatus = item.status === "I lost it😥" ? "I found it🤨" : "I lost it😥";

          const matchQuery = query(
            collection(db, "lostItems"),
            where("object", "==", item.object),
            where("place", "==", item.place),
            where("status", "==", oppositeStatus),
            where("userId", "!=", userId)
          );

          const matchSnapshot = await getDocs(matchQuery);
          const matchData: LostItem[] = matchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LostItem));

          matches = [...matches, ...matchData];
        }

        setMatchedItems(matches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F5F5F5" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>Matched Items</Text>

      {matchedItems.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#666" }}>No matching items found</Text>
      ) : (
        <FlatList
          data={matchedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ backgroundColor: "#fff", padding: 16, marginBottom: 10, borderRadius: 8 }}
              onPress={() => router.push({ pathname: "/myitems", params: { id: item.id } })}
            >
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.object}</Text>
              <Text style={{ color: "#666" }}>{item.description}</Text>
              <Text style={{ fontStyle: "italic" }}>Reported by another user</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
