// app/Repositories/SummariesRepository.ts
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const SummariesRepository = {
  async getSummariesSettings() {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return null;

    const ref = doc(db, "users", uid, "settings", "summaries");
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? snapshot.data() : null;
  },

  async updateSummariesSettings(data: Partial<{
    suggestedPayment: boolean;
    currencies: boolean;
    dates: boolean;
    categories: boolean;
  }>) {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;

    const ref = doc(db, "users", uid, "settings", "summaries");
    await setDoc(ref, data, { merge: true });
  }
};

export default SummariesRepository;
