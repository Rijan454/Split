import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

const logo = require("../assets/images/Split-logo.png"); // Make sure this is your latest logo

export default function AboutScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleFacebookSupport = () => {
    Linking.openURL("https://www.facebook.com"); // Replace with actual Split Facebook page if available
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={32} color="#000" />
        </TouchableOpacity>

        <Image source={logo} style={styles.logo} />

        <Text style={styles.introTitle}>Hi,!</Text>
        <Text style={styles.description}>
          Welcome to Split, an app created to make life simpler and more
          organized when it comes to shared expenses.
        </Text>

        <Text style={styles.description}>
          Split is more than just an app; it’s a tool to keep your shared
          experiences fun and worry-free. Whether it’s splitting rent with
          roommates, organizing group trips, or planning events, Split is here
          to help you stay organized and stress-free.
        </Text>

        <Text style={styles.description}>
          Thank you for choosing Split! I hope it makes managing your shared
          expenses easier and your shared moments even more enjoyable.
        </Text>

        <Text style={styles.supportText}>Support split in facebook.</Text>

        <TouchableOpacity onPress={handleFacebookSupport}>
          <Ionicons name="logo-facebook" size={32} color="#1877F2" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#2DBCC0",
  },
  scrollContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#000",
  },
  supportText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8,
    textAlign: "center",
  },
});
