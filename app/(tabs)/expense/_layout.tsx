/*import { Stack } from "expo-router";

export default function ExpenseStack() {
  return <Stack />;
}*/
import { Slot, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";

export default function RootLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const data = Linking.parse(event.url);
      
      // Fix: ensure groupId is string (not string[])
      const groupId = Array.isArray(data.queryParams?.inviteGroupId)
        ? data.queryParams.inviteGroupId[0]
        : data.queryParams?.inviteGroupId;

      if (groupId && user?.uid) {
        try {
          // Add user to group's members subcollection
          await setDoc(doc(db, "groups", groupId, "members", user.uid), {
            uid: user.uid,
            name: user.displayName || "Anonymous",
            avatar: "",
            balance: 0,
          });

          //  Save groupId under the user document
          await setDoc(
            doc(db, "users", user.uid),
            { group: groupId },
            { merge: true }
          );

          Alert.alert("🎉 Group Joined!", "You've successfully joined the group.");
          router.replace("/"); // Navigate to your home/summary screen
        } catch (error) {
          console.error("Error joining group:", error);
          Alert.alert("Error", "Could not join group. Please try again.");
        }
      }
    };

    // ✅ Handle case: app launched by link (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url } as Linking.EventType);
      }
    });

    //  Handle case: app already open and receives a link
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, [user]);

  return <Slot />;
}
