// app/Repositories/ExpenseRepository.ts

import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface Expense {
  title: string;
  amount: number;
  by: string;
  byName?: string;              // Optional display name of payer
  for: string[];                // UIDs of members involved
  forMemberNames?: string[];    // Optional display names of members
  currency: string;
  date?: string;                // Optional date string
}

export const ExpenseRepository = {
  async saveExpense(expense: Expense) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not logged in");

    const ref = collection(db, "users", uid, "expenses");

    await addDoc(ref, {
      ...expense,
      byName: expense.byName || expense.by || "Anonymous",          // ensure name saved
      forMemberNames: expense.forMemberNames || [],                 // NEW: save names
      date: expense.date || new Date().toISOString().split("T")[0], // fallback to today
      createdAt: serverTimestamp(),
    });
  },
};