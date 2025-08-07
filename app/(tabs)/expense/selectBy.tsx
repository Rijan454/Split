import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function SelectBy() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();

  const [members, setMembers] = useState<{ uid: string; name: string }[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user) return;

      const ref = collection(db, "users", user.uid, "groupMembers");
      const snap = await getDocs(ref);
      const data = snap.docs.map((doc) => ({
        uid: doc.id,
        name: doc.data().name,
      }));
      setMembers(data);
    };

    fetchMembers();
  }, [user]);

  const handleSelect = (member: { uid: string; name: string }) => {
    router.push({
      pathname: "/expense/newExpense",
      params: {
        ...params,
        by: member.uid,
        byName: member.name,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Payer</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  item: {
    backgroundColor: "#f3e8e9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
  },
});