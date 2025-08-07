import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Expense, calculateBalances, MemberBalance } from './Repositories/calculateBalance';

export default function SuggestPayments() {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const expensesSnapshot = await getDocs(collection(db, 'users', uid, 'expenses'));
      const expenses: Expense[] = expensesSnapshot.docs.map((doc) => doc.data() as Expense);

      const balancesMap = calculateBalances(expenses);
      const balances = Object.values(balancesMap);

      const creditors = balances.filter((m) => m.balance > 0).sort((a, b) => b.balance - a.balance);
      const debtors = balances.filter((m) => m.balance < 0).sort((a, b) => a.balance - b.balance);

      const results: string[] = [];

      let i = 0, j = 0;
      while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(creditor.balance, -debtor.balance);

        if (amount > 0) {
          results.push(`${debtor.name} owes ${creditor.name} $${amount.toFixed(2)}`);
          debtor.balance += amount;
          creditor.balance -= amount;
        }

        if (Math.abs(debtor.balance) < 0.01) i++;
        if (Math.abs(creditor.balance) < 0.01) j++;
      }

      setSuggestions(results);
    };

    fetchSuggestions();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Suggested Payments</Text>
      {suggestions.length === 0 ? (
        <Text style={styles.noSuggestion}>No payments required. Everyone is settled.</Text>
      ) : (
        suggestions.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item}
          </Text>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    fontSize: 16,
    marginVertical: 6,
  },
  noSuggestion: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
});