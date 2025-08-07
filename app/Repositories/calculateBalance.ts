export type Expense = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: string;
  by?: { uid: string; name: string };  // make optional
  for?: { uid: string; name: string }[];
};

export interface MemberBalance {
  uid: string;
  name: string;
  balance: number;
}

export function calculateBalances(expenses: Expense[]): { [uid: string]: MemberBalance } {
  const balances: { [uid: string]: MemberBalance } = {};

  for (const expense of expenses) {
    if (!expense.by || !expense.for || !Array.isArray(expense.for) || expense.for.length === 0) {
      console.warn("Skipping invalid expense:", expense); // For debugging
      continue;
    }

    const payerUid = expense.by.uid;
    const payerName = expense.by.name;
    const involved = expense.for;
    const splitAmount = expense.amount / involved.length;

    // Initialize payer
    if (!balances[payerUid]) {
      balances[payerUid] = { uid: payerUid, name: payerName, balance: 0 };
    }
    balances[payerUid].balance += expense.amount;

    // Subtract share from each involved member
    for (const person of involved) {
      if (!balances[person.uid]) {
        balances[person.uid] = { uid: person.uid, name: person.name, balance: 0 };
      }
      balances[person.uid].balance -= splitAmount;
    }
  }

  return balances;
}