// app/Repositories/ExpenseRepository.ts
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const ExpenseRepository = {
  async saveExpense(expense: {
    title: string;
    amount: number;
    by: string;
    for: string[];
    currency: string;
    date: string; // Assume string for now
  }) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not logged in");

    const ref = collection(db, "users", uid, "expenses");
    await addDoc(ref, {
      ...expense,
      createdAt: serverTimestamp(),
    });
  },
};
