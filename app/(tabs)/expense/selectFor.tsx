import React, { useEffect, useState } from "react";
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

export default function SelectFor() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const [members, setMembers] = useState<{ uid: string; name: string }[]>([]);
  const [selected, setSelected] = useState<
    { uid: string; name: string }[]
  >([]);

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

  const toggleSelect = (member: { uid: string; name: string }) => {
    const isSelected = selected.some((m) => m.uid === member.uid);
    if (isSelected) {
      setSelected((prev) => prev.filter((m) => m.uid !== member.uid));
    } else {
      setSelected((prev) => [...prev, member]);
    }
  };

  const handleDone = () => {
    router.push({
      pathname: "/expense/newExpense",
      params: {
        ...params,
        forMembers: JSON.stringify(selected),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Recipients</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => {
          const isSelected = selected.some((m) => m.uid === item.uid);
          return (
            <TouchableOpacity
              style={[styles.item, isSelected && styles.selected]}
              onPress={() => toggleSelect(item)}
            >
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
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
  selected: {
    backgroundColor: "#d1c4e9",
  },
  name: {
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: "black",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  doneText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});