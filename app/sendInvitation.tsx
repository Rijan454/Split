import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function SendInvitation() {
  const { user } = useAuth();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) fetchGroupId();
  }, [user]);

  const fetchGroupId = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      setGroupId(data.group || null);
    }
  };

  const generateLink = () => {
    if (!groupId) return;
    const link = `http://localhost:8081/joinGroup?groupId=${groupId}`;
    setInviteLink(link);
  };

  const shareLink = async () => {
    if (inviteLink) {
      await Share.share({ message: `Join my group in Split app: ${inviteLink}` });
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="send" size={60} color="white" />
      <Text style={styles.title}>Invite to Split Group</Text>
      {inviteLink ? (
        <>
          <Text style={styles.link}>{inviteLink}</Text>
          <TouchableOpacity style={styles.shareButton} onPress={shareLink}>
            <Text style={styles.shareText}>Share Invitation</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.generateButton} onPress={generateLink}>
          <Text style={styles.shareText}>Generate Invite Link</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#25bfc4", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: "white", marginTop: 15 },
  link: { marginVertical: 15, color: "white", fontStyle: "italic" },
  shareButton: { backgroundColor: "white", padding: 10, borderRadius: 10 },
  generateButton: { marginTop: 20, backgroundColor: "#fff", padding: 10, borderRadius: 10 },
  shareText: { color: "#25bfc4", fontWeight: "bold" },
});