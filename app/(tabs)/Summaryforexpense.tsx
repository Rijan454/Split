// app/(tabs)/Summaryforexpense.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Define Expense type
type Expense = {
  id: string;
  title: string;
  amount: number;
  by: string;
  for: string[];
  currency: string;
  date: string;
};

export default function Summaryforexpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const snapshot = await getDocs(collection(db, "users", uid, "expenses"));
        const loadedExpenses: Expense[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[];

        setExpenses(loadedExpenses);
      } catch (error) {
        console.error("Failed to load expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.card} key={item.id}>
      <View style={styles.rowBetween}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.amount}>
          {item.currency} {item.amount.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.label}>Paid by: {item.by}</Text>
      <Text style={styles.label}>For: {item.for.join(", ")}</Text>
      <Text style={styles.label}>Date: {item.date}</Text>
      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Summary</Text>
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  amount: {
    color: "green",
    fontWeight: "bold",
  },
  label: {
    marginTop: 4,
    color: "#333",
  },
  deleteButton: {
    marginTop: 10,
    alignItems: "flex-end",
  },
});
