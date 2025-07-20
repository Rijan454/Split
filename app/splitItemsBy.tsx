import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

export default function SplitItemsByScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      {/* Option: Percent */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Percent</Text>
      </TouchableOpacity>

      {/* Option: Share */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Share</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  option: {
    backgroundColor: "#EFEAEA",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  optionText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});