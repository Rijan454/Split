import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function SelectFor() {
  const router = useRouter();
  const uid = auth.currentUser?.uid;
  const {
    title = "",
    amount = "",
    currency = "AUD",
    date = "",
    byMember = "",
    forMembers: initialFor = "[]",
  } = useLocalSearchParams();

  const [members, setMembers] = useState<string[]>([]);
  const [selectedFor, setSelectedFor] = useState<string[]>(
    JSON.parse(initialFor as string)
  );

  useEffect(() => {
    const fetchMembers = async () => {
      if (!uid) return;
      try {
        const snapshot = await getDocs(collection(db, "users", uid, "groupMembers"));
        const names = snapshot.docs.map((doc) => doc.data().name);
        setMembers(names);
      } catch (error) {
        console.error("Error loading group members:", error);
      }
    };

    fetchMembers();
  }, [uid]);

  const toggleMember = (name: string) => {
    setSelectedFor((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleDone = () => {
    router.push({
      pathname: "/expense/newExpense",
      params: {
        title,
        amount,
        currency,
        date,
        byMember,
        forMembers: JSON.stringify(selectedFor),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select For Members</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item}</Text>
            <Switch
              value={selectedFor.includes(item)}
              onValueChange={() => toggleMember(item)}
            />
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleDone}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  name: {
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
