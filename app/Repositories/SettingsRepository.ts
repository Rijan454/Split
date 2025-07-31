// app/Repositories/SettingsRepository.ts

import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const SettingsRepository = {
  // Fetch preferences from Firestore
  async getSettings() {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return null;

    const docRef = doc(db, "users", uid, "settings", "preferences");
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  },

  // Update preferences in Firestore
  async updateSettings(data: Partial<{ pushNotification: boolean; wallpaperMotion: boolean }>) {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;

    const docRef = doc(db, "users", uid, "settings", "preferences");
    await setDoc(docRef, data, { merge: true });
  },
};

export default SettingsRepository;
