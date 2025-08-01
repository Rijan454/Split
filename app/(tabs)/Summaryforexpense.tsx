import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import { Ionicons } from "@expo/vector-icons";

const formatDate = (date: any): string => {
  if (!date) return new Date().toISOString().split("T")[0];
  if (date instanceof Timestamp) return date.toDate().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
};

export default function SummaryforExpense() {
  const { user } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);

  const fetchExpenses = async () => {
    try {
      if (!user) return;
      const ref = collection(db, "users", user.uid, "expenses");
      const snap = await getDocs(ref);
      const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(items);
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!user) return;
      await deleteDoc(doc(db, "users", user.uid, "expenses", id));
      console.log("Deleted:", id);
      fetchExpenses(); // Refresh after delete
    } catch (err) {
      console.error("Error deleting expense", err);
      Alert.alert("Delete failed", "Could not delete expense.");
    }
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() =>
        Alert.alert("Delete", "Are you sure you want to delete this item?", [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => handleDelete(id) },
        ])
      }
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.card}>
        <View style={styles.left}>
          <Ionicons name="receipt-outline" size={30} color="black" />
        </View>
        <View style={styles.middle}>
          <Text style={styles.bold}>{item.title || "Category"}</Text>
          <Text>Member: {item.byName|| "Anonymous"}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.bold}>${item.amount}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <MenuProvider>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/expense/newExpense")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Expenses Summary</Text>
          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => Alert.alert("Send Invitation")}>
                <Text style={styles.menuText}>Send Invitation</Text>
              </MenuOption>
              <MenuOption onSelect={() => Alert.alert("Download Summary")}>
                <Text style={styles.menuText}>Download Summary</Text>
              </MenuOption>
              <MenuOption onSelect={() => {}}>
                <Text style={[styles.menuText, { color: "red" }]}>Cancel</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </GestureHandlerRootView>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#e5e5e5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  left: {
    marginRight: 12,
  },
  middle: {
    flex: 1,
  },
  right: {
    alignItems: "flex-end",
  },
  bold: {
    fontWeight: "600",
    fontSize: 16,
  },
  date: {
    color: "gray",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 10,
    marginVertical: 8,
    marginRight: 16,
  },
  menuText: {
    padding: 10,
    fontSize: 16,
  },
});
