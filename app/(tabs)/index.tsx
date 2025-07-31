import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const logo = require("../../assets/images/Split-logo.png");

export default function HomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/createGroup"); // Navigate to createGroup screen
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image} />
      <Text style={styles.title}>Simplify Sharing, Split with Ease.</Text>
      <Text style={styles.description}>
        Easily manage shared expenses and keep your balances clear.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#3BE7CD",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});