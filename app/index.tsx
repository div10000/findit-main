import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" }}>
        Welcome to FindIt
      </Text>
      <TouchableOpacity 
        style={{ backgroundColor: "#4CAF50", padding: 15, borderRadius: 8 }} 
        onPress={() => router.push("/login")}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;
