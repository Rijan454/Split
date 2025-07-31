import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function CreateGroup() {
  const router = useRouter();

  const handleAddGroupMember = () => {
    router.push("/addGroupMember");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleAboutSplit = () => {
    router.push("/about");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Home</Text>

      <TouchableOpacity style={styles.box} onPress={handleAddGroupMember}>
        <Text style={styles.boxText}>Add Group Member</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={handleSettings}>
        <Text style={styles.boxText}>Setting</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={handleAboutSplit}>
        <Text style={styles.boxText}>About Split</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
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
