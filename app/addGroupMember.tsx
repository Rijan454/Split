import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function MemberScreen() {
  const router = useRouter();

  const members = ["Member 1", "Member 2", "Member 3", "Member 4"];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      {/* Member List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {members.map((member, index) => (
          <View key={index} style={styles.memberItem}>
            <Text style={styles.memberText}>{member}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Add More Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add More member</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  listContainer: {
    paddingTop: 40,
    paddingBottom: 100,
  },
  memberItem: {
    backgroundColor: "#F0EAEA",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  memberText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#3BE7CD",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  addButtonText: {
    fontWeight: "bold",
    color: "#000",
  },
});