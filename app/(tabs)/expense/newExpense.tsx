// app/(tabs)/expense/newExpense.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ExpenseRepository } from "../../Repositories/ExpenseRepository";

import { auth } from "../../../lib/firebase";

export default function NewExpense() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [title, setTitle] = useState(
    typeof params.title === "string" ? params.title : ""
  );
  const [amount, setAmount] = useState(
    typeof params.amount === "string" ? params.amount : ""
  );
  const [by, setBy] = useState(
    typeof params.by === "string" ? params.by : ""
  );
  const [forMembers, setForMembers] = useState(() => {
    if (typeof params.forMembers === "string") {
      try {
        return JSON.parse(params.forMembers);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [currency, setCurrency] = useState(
    typeof params.currency === "string" ? params.currency : "AUD"
  );
  const [date, setDate] = useState(
    typeof params.date === "string" ? params.date : ""
  );

  const validateAndSave = async () => {
    if (!title || !amount || !by || forMembers.length === 0 || !currency) {
      Alert.alert("Missing Information", "Please fill all fields.");
      return;
    }

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("User not logged in");

      await ExpenseRepository.saveExpense({
        title,
        amount: parseFloat(amount), // make sure it's a number
        by,
        for: forMembers,
        currency,
        date,
      });

      router.push("/Summaryforexpense");
    } catch (error) {
      console.error("Error saving expense:", error);
      Alert.alert("Error", "Could not save expense.");
    }
  };

  const handleCancel = () => {
    router.push("/expense");
  };

  const toQuery = {
    title,
    amount,
    currency,
    date,
    forMembers: JSON.stringify(forMembers),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Expense</Text>
        <TouchableOpacity onPress={validateAndSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.input}
        onPress={() =>
          router.push({ pathname: "/expense/selectBy", params: toQuery })
        }
      >
        <Text style={styles.label}>By</Text>
        <Text style={styles.value}>{by || "Select"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() =>
          router.push({ pathname: "/expense/selectFor", params: toQuery })
        }
      >
        <Text style={styles.label}>For</Text>
        <Text style={styles.value}>
          {forMembers.length > 0 ? forMembers.join(", ") : "Select"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Currency (e.g. AUD, USD)"
        value={currency}
        onChangeText={setCurrency}
      />

      <TextInput
        style={styles.input}
        placeholder="Date (e.g. 2025-07-31)"
        value={date}
        onChangeText={setDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cancel: {
    color: "red",
    fontWeight: "bold",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  save: {
    color: "red",
    fontWeight: "bold",
  },
  input: {
    padding: 16,
    backgroundColor: "#f3e8e9",
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    marginTop: 4,
    color: "#555",
  },
});
