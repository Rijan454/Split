// /screens/joinGroup.tsx
import React, { useEffect } from "react";
import { Text, View, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default function JoinGroup() {
  const { user } = useAuth();
  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const joinGroup = async () => {
      if (!user?.uid || !groupId) return;

      try {
        // Add user to group's members array
        const groupRef = doc(db, "groups", groupId as string);
        await updateDoc(groupRef, {
          members: arrayUnion(user.uid),
        });

        // Update user's group field
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          group: groupId,
        });

        Alert.alert("Joined!", "You’ve been added to the group.");
        router.push("/"); // Navigate to home/dashboard
      } catch (error) {
        console.error("Failed to join group:", error);
        Alert.alert("Error", "Could not join group.");
      }
    };

    joinGroup();
  }, [user, groupId]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Joining Group...</Text>
    </View>
  );
}
