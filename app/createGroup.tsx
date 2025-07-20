import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

export default function CreateGroup() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const handleAddGroupMember = () => {
    // Navigate to the Add Group Member screen (update path as needed)
    router.push("/addGroupMember");
  };

  const handleExpense = () => {
    // Navigate to the Expense screen 
    router.push("/expense");
  };

  const handleSettings = () => {
    // Navigate to Settings screen (update path as needed)
    router.push("/settings");
  };

  const handleAboutSplit = () => {
    // Navigate to About Split screen (update path as needed)
    router.push("/about");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Ionicons name="chevron-back" size={32} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={handleAddGroupMember}>
        <Text style={styles.boxText}>Add Group Member</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={handleSettings}>
        <Text style={styles.boxText}>Setting</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={handleAboutSplit}>
        <Text style={styles.boxText}>About split</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  backButton: {
    marginLeft: 16,
    marginBottom: 40,
  },
  box: {
    backgroundColor: "#eee7e7",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  boxText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});
