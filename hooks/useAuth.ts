import { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Extend the Firebase user with your own fields
interface ExtendedUser extends FirebaseUser {
  group?: string;
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        // Merge Firebase user with Firestore fields (e.g., group)
        const extendedUser: ExtendedUser = {
          ...firebaseUser,
          ...userData, // includes group
        };

        setUser(extendedUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user };
}
