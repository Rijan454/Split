// app/Repositories/ExpenseRepository.ts
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const ExpenseRepository = {
  async saveExpense(expense: {
    title: string;
    amount: number;
    by: string;
    byName?: string;      // added for display
    for: string[];
    currency: string;
    date?: string;
  }) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not logged in");

    const ref = collection(db, "users", uid, "expenses");

    await addDoc(ref, {
      ...expense,
      byName: expense.byName || expense.by || "Anonymous",  // ✅ ensure fallback
      date: expense.date || new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
    });
  },
};
