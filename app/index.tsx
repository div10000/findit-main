import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Animated, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import icon from "../assets/images/icon.png";

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Start opacity at 0
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Start with smaller size

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

  useEffect(() => {
    // Run animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in to full opacity
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 3.5, // Scale to normal size
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5", position: "relative" }}>
  
      {/* Welcome Text at Top */}
      <Text style={{
        fontSize: 35, fontWeight: "bold", color: "#333",
        position: "absolute", top:'5%', left: 0, right: 0, textAlign: "center"
      }}>
        Welcome to FindIt
      </Text>
  
      {/* Animated Image at Center */}
      <Animated.Image
        source={icon}
        style={{
          width: 120, height: 120, opacity: fadeAnim, transform: [{ scale: scaleAnim }],
          position: "absolute", top: "40%", left: "50%", marginLeft: -60 // Centered
        }}
      />
  
      {/* Enter Button Below Icon */}
      <TouchableOpacity 
        style={{
          backgroundColor: "#4CAF50", padding: 15, borderRadius: 8,
          position: "absolute", top: "85%", left: 0, right: 0, // Centered
        }} 
        onPress={() => router.push("/login")}
      >
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold", textAlign: "center" }}>Enter</Text>
      </TouchableOpacity>
  
    </View>
  );
  
};

export default Index;
