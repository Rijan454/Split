// app/(tabs)/expense/selectBy.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function SelectBy() {
  const router = useRouter();
  const { title, amount, currency, date, forMembers } = useLocalSearchParams();

  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const snapshot = await getDocs(
          collection(db, "users", uid, "groupMembers")
        );

        const names = snapshot.docs.map((doc) => doc.data().name);
        setMembers(names);
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleSelect = (member: string) => {
    router.push({
      pathname: "/expense/newExpense",
      params: {
        title,
        amount,
        currency,
        date,
        by: member, // ✅ Correct param name
        forMembers: forMembers ? forMembers.toString() : "", // ✅ Ensure string format
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Member Who Paid</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={styles.item}
          >
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  item: {
    backgroundColor: "#f3e8e9",
    padding: 16,
    marginBottom: 10,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
