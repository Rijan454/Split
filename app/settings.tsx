import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const router = useRouter();

  const [pushNotifications, setPushNotifications] = useState(false);
  const [wallpaperMotion, setWallpaperMotion] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      {/* Split Items By */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.leftSection}
          onPress={() => router.push("/splitItemsBy")}
        >
          <Text style={styles.label}>Split Items By</Text>
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={22} color="black" />
      </View>

      {/* Switches */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Push Notification</Text>
        <Switch
          value={pushNotifications}
          onValueChange={setPushNotifications}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Wallpaper Motion</Text>
        <Switch
          value={wallpaperMotion}
          onValueChange={setWallpaperMotion}
        />
      </View>

      {/* Summaries */}
      <TouchableOpacity style={styles.row} onPress={() => router.push("/summaries")}>
        <Text style={styles.label}>Summaries</Text>
        <Ionicons name="chevron-forward" size={22} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  row: {
    backgroundColor: "#EFEAEA",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchRow: {
    backgroundColor: "#EFEAEA",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
});