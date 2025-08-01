// app/(tabs)/expense/expenseDetail.tsx

import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function ExpenseDetail() {
  const { title, amount, currency, date, byMember, forMembers } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Expense Details</Text>

      <View style={styles.itemBox}>
        <Text style={styles.label}>Title:</Text>
        <Text style={styles.value}>{title}</Text>
      </View>

      <View style={styles.itemBox}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{currency} {amount}</Text>
      </View>

      <View style={styles.itemBox}>
        <Text style={styles.label}>Paid By:</Text>
        <Text style={styles.value}>{byMember || "Anonymous"}</Text>
      </View>

      <View style={styles.itemBox}>
        <Text style={styles.label}>Shared With:</Text>
        <Text style={styles.value}>{forMembers || "Anonymous"}</Text>
      </View>

      <View style={styles.itemBox}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{date}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  itemBox: {
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 18,
    color: "#000",
  },
});