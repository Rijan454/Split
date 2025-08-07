import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';

interface Member {
  id: string;
  name: string;
  balance: number;
}

interface PaymentSuggestion {
  from: string;
  to: string;
  amount: number;
}

export default function SuggestPaymentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [suggestions, setSuggestions] = useState<PaymentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user?.uid) return;
      setLoading(true);

      const q = collection(db, 'users', user.uid, 'groupMembers');
      const snapshot = await getDocs(q);

      const fetchedMembers: Member[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        balance: doc.data().balance || 0,
      }));

      setMembers(fetchedMembers);
      setLoading(false);
      computeSuggestions(fetchedMembers);
    };

    fetchMembers();
  }, [user?.uid]);

  const computeSuggestions = (members: Member[]) => {
    const debtors = [...members].filter(m => m.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = [...members].filter(m => m.balance > 0).sort((a, b) => b.balance - a.balance);

    const result: PaymentSuggestion[] = [];

    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Math.min(-debtor.balance, creditor.balance);

      if (amount > 0) {
        result.push({
          from: debtor.name,
          to: creditor.name,
          amount: parseFloat(amount.toFixed(2)),
        });

        debtor.balance += amount;
        creditor.balance -= amount;
      }

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (creditor.balance < 0.01) j++;
    }

    setSuggestions(result);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.doneButton}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : (
        <ScrollView>
          {suggestions.length === 0 ? (
            <Text style={styles.emptyText}>No payments needed 🎉</Text>
          ) : (
            suggestions.map((s, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.text}>
                  From {s.from}{"\n"}To {s.to}
                </Text>
                <Text style={styles.amount}>A${s.amount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  doneButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  doneText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    backgroundColor: '#f0eaea',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
});
