import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from "react-native-popup-menu";
import * as Print from "expo-print";

import { shareAsync } from "expo-sharing";
import Constants from 'expo-constants';

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
      const expensesRef = collection(db, "users", user.uid, "expenses");
      const q = query(expensesRef, orderBy("date", "desc"));
      const snap = await getDocs(q);

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
      fetchExpenses();
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
          {
            text: "Delete",
            style: "destructive",
            onPress: () => handleDelete(id),
          },
        ])
      }
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const downloadPDF = async () => {
    const html = `
      <html>
        <body>
          <h1>Expense Summary</h1>
          ${expenses.map((exp) => `
            <div>
              <h3>${exp.title}</h3>
              <p><strong>Paid By:</strong> ${exp.byName ?? exp.by ?? "Unknown"}</p>
              <p><strong>Shared With:</strong> ${exp.forMemberNames?.join(", ") ?? "Not shared"}</p>
              <p><strong>Amount:</strong> $${exp.amount}</p>
              <p><strong>Date:</strong> ${formatDate(exp.date)}</p>
              <hr />
            </div>
          `).join("")}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/expense/expenseDetail",
            params: {
              title: item.title,
              amount: item.amount,
              date: formatDate(item.date),
              byMember: item.byName ?? item.by ?? "Unknown",
              forMembers: item.forMemberNames?.length
                ? item.forMemberNames.join(", ")
                : "Not shared",
            },
          })
        }
      >
        <View style={styles.card}>
          <View style={styles.left}>
            <Ionicons name="receipt-outline" size={30} color="black" />
          </View>
          <View style={styles.middle}>
            <Text style={styles.bold}>{item.title || "Untitled"}</Text>
            <Text>Paid By: {item.byName ?? item.by ?? "Unknown"}</Text>
            <Text>
              Shared With: {item.forMemberNames?.length ? item.forMemberNames.join(", ") : "Not shared"}
            </Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.bold}>${item.amount}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
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
              <MenuOption onSelect={() => router.push("/sendInvitation")}> 
                <Text style={styles.menuText}>Send Invitation</Text>
              </MenuOption>
              <MenuOption onSelect={downloadPDF}>
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
    paddingTop: Constants.statusBarHeight,
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
