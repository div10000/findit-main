import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
}

export default function Rewards() {
  const [userPoints, setUserPoints] = useState<number>(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch user points
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserPoints(data.points || 0);
      }

      // Fetch rewards catalog
      const rewardsSnapshot = await getDocs(collection(db, "rewards"));
      const rewardsData: Reward[] = rewardsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        pointsRequired: doc.data().pointsRequired,
      }));
      setRewards(rewardsData);

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleRedeem = async (reward: Reward) => {
    if (!userId) return;

    if (userPoints < reward.pointsRequired) {
      Alert.alert("Not enough points", `You need ${reward.pointsRequired} points to redeem this reward.`);
      return;
    }

    try {
      // Deduct points
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { points: userPoints - reward.pointsRequired });

      setUserPoints(prev => prev - reward.pointsRequired);

      Alert.alert("Success", `You have redeemed "${reward.name}"!`);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F5F5F5" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
        Your Points: {userPoints}
      </Text>

      {rewards.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#666" }}>No rewards available</Text>
      ) : (
        <FlatList
          data={rewards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: "#fff", padding: 16, marginBottom: 12, borderRadius: 8 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.name}</Text>
              <Text style={{ color: "#666", marginBottom: 8 }}>{item.description}</Text>
              <Text style={{ fontStyle: "italic", marginBottom: 8 }}>Points Required: {item.pointsRequired}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: userPoints >= item.pointsRequired ? "#4CAF50" : "#ccc",
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                disabled={userPoints < item.pointsRequired}
                onPress={() => handleRedeem(item)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {userPoints >= item.pointsRequired ? "Redeem" : "Insufficient Points"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
