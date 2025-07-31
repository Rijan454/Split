import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

export default function Expenses() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* New Expenses */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => router.push("/expense/newExpense")}

      >
        <Text style={styles.boxText}>
          💵 New Expenses
        </Text>
      </TouchableOpacity>

      {/* Payment */}
      <TouchableOpacity style={styles.box} onPress={() => alert("Coming soon!")}>
        <Text style={styles.boxText}>
          💬 Payment
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    padding: 16,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  box: {
    backgroundColor: "#eee6e6",
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  boxText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});