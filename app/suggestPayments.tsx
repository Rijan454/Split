import { useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function SuggestPaymentsScreen() {
  const router = useRouter();

  // Dummy suggestions for now
  const suggestions = [
    { from: 'Member 1', to: 'Member 2', amount: 0 },
    { from: 'Member 1', to: 'Member 3', amount: 0 },
    { from: 'Member 1', to: 'Member 4', amount: 0 },
    { from: 'Member 7', to: 'Member 1', amount: 0 },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.doneButton}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>

      <ScrollView>
        {suggestions.map((s, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.text}>
              From {s.from}{"\n"}To {s.to}
            </Text>
            <Text style={styles.amount}>${s.amount.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
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
});