import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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

  const [byMember, setByMember] = useState(() => {
    const rawBy = params.by;
    const rawByName = params.byName;

    const by = Array.isArray(rawBy) ? rawBy[0] : rawBy;
    const byName = Array.isArray(rawByName) ? rawByName[0] : rawByName;

    return {
      uid: typeof by === "string" ? by : "",
      name: typeof byName === "string" ? byName : "Anonymous",
    };
  });

  const [forMembers, setForMembers] = useState(() => {
    if (typeof params.forMembers === "string") {
      try {
        const parsed = JSON.parse(params.forMembers);
        return Array.isArray(parsed) ? parsed : [];
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

  const handleCancel = () => {
    router.push("/expense");
  };

  const toQuery = {
    title,
    amount,
    currency,
    date,
    forMembers: JSON.stringify(forMembers),
    by: byMember?.uid,
    byName: byMember?.name,
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setByMember(null);
    setForMembers([]);
    setCurrency("AUD");
    setDate("");
  };

  const validateAndSave = async () => {
    if (!title || !amount) {
      Alert.alert("Missing Info", "Please fill in both Title and Amount.");
      return;
    }

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("User not logged in");

      const today = new Date().toISOString().split("T")[0];

      const forUids = forMembers.map((m: any) => m.uid);
      const forNames = forMembers.map((m: any) => m.name);

      await ExpenseRepository.saveExpense({
        title,
        amount: parseFloat(amount),
        by: byMember?.uid || "Anonymous",
        byName: byMember?.name || "Anonymous",
        for: forUids.length > 0 ? forUids : [],
        forMemberNames: forNames.length > 0 ? forNames : [],
        currency,
        date: date || today,
      });

      resetForm();
      Alert.alert("Success", "Expense saved successfully.");
    } catch (error) {
      console.error("Error saving expense:", error);
      Alert.alert("Error", "Failed to save expense.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
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
          <Text style={styles.value}>{byMember?.name || "Select"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() =>
            router.push({ pathname: "/expense/selectFor", params: toQuery })
          }
        >
          <Text style={styles.label}>For</Text>
          <Text style={styles.value}>
            {forMembers.length > 0
              ? forMembers.map((m: any) => m.name).join(", ")
              : "Select"}
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
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
