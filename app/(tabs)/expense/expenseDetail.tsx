// app/(tabs)/expense/expenseDetail.tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExpenseDetail() {
  const router = useRouter();
  const { title, amount, currency, date, byMember, forMembers } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Heading */}
      <Text style={styles.heading}>Expense Details</Text>

      {/* Card View */}
      <View style={styles.card}>
        <View style={styles.itemBox}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{title}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>
            {currency} {amount}
          </Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={styles.label}>Paid By</Text>
          <Text style={styles.value}>{byMember || "Anonymous"}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={styles.label}>Shared With</Text>
          <Text style={styles.value}>{forMembers || "Anonymous"}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#007AFF",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemBox: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
    fontWeight: "600",
  },
  value: {
    fontSize: 18,
    color: "#333",
  },
});
