import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SendInvitation() {
  const { user } = useAuth();
  const router = useRouter();

  const baseURL = Linking.createURL("/"); //  Generates a valid Expo deep link
  const inviteLink = `${baseURL}?inviteGroupId=${user?.group}`; // Add user?.group if you saved it

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(inviteLink);
    Alert.alert(" Link Copied", "Your invitation link has been copied!");
  };

  const openWhatsApp = async () => {
    const message = `Join my Split group: ${inviteLink}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert("WhatsApp not available", "Please install WhatsApp to share the link.");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Invite your friends to join your group
      </Text>

      <TouchableOpacity
        onPress={copyToClipboard}
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 10,
          marginBottom: 12,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>📋 Copy Invitation Link</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={openWhatsApp}
        style={{
          backgroundColor: "#25D366",
          padding: 15,
          borderRadius: 10,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>💬 Send via WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
}
