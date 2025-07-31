import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Expenses() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* New Expenses */}
      <TouchableOpacity style={styles.box}>
        <Text style={styles.boxText}>
          <Text role="img" aria-label="money">💵</Text>  New Expenses
        </Text>
      </TouchableOpacity>

      {/* Payment */}
      <TouchableOpacity style={styles.box}>
        <Text style={styles.boxText}>
          <Text role="img" aria-label="payment">💬</Text>  Payment
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