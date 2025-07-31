import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SettingsRepository from "./Repositories/SettingsRepository"; // default import

export default function SettingsScreen() {
  const router = useRouter();

  const [pushNotifications, setPushNotifications] = useState(false);
  const [wallpaperMotion, setWallpaperMotion] = useState(false);

  // Load preferences from Firestore
  useEffect(() => {
    const fetchPreferences = async () => {
      const prefs = await SettingsRepository.getSettings(); // correct method
      if (prefs) {
        setPushNotifications(prefs.pushNotification ?? false);
        setWallpaperMotion(prefs.wallpaperMotion ?? false);
      }
    };
    fetchPreferences();
  }, []);

  // Update preferences handler
  const updatePreference = (
    key: "pushNotification" | "wallpaperMotion",
    value: boolean
  ) => {
    if (key === "pushNotification") {
      setPushNotifications(value);
      SettingsRepository.updateSettings({ pushNotification: value });
    } else if (key === "wallpaperMotion") {
      setWallpaperMotion(value);
      SettingsRepository.updateSettings({ wallpaperMotion: value });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Split Items By */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/splitItemsBy")}
        >
          <Text style={styles.label}>Split Items By</Text>
          <Ionicons name="chevron-forward" size={22} color="black" />
        </TouchableOpacity>

        {/* Push Notification Toggle */}
        <View style={styles.switchRow}>
          <Text style={styles.label}>Push Notification</Text>
          <Switch
            value={pushNotifications}
            onValueChange={(value) =>
              updatePreference("pushNotification", value)
            }
          />
        </View>

        {/* Wallpaper Motion Toggle */}
        <View style={styles.switchRow}>
          <Text style={styles.label}>Wallpaper Motion</Text>
          <Switch
            value={wallpaperMotion}
            onValueChange={(value) =>
              updatePreference("wallpaperMotion", value)
            }
          />
        </View>

        {/* Summaries */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/Summaries")}
        >
          <Text style={styles.label}>Summaries</Text>
          <Ionicons name="chevron-forward" size={22} color="black" />
        </TouchableOpacity>
      </View>
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
  content: {
    marginTop: 40,
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
