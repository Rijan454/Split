import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // adjust path as needed

export default function SplitItemsByScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'Percentage' | 'Share' | null>(null);
  const auth = getAuth();

  const uid = auth.currentUser?.uid;

  // Fetch saved selection on load
  useEffect(() => {
    const fetchSelection = async () => {
      if (!uid) return;

      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.splitType) {
          setSelectedType(data.splitType);
        }
      }
    };

    fetchSelection();
  }, [uid]);

  // Save selection to Firestore
  const handleOptionPress = async (type: 'Percentage' | 'Share') => {
    if (!uid) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', uid),
        { splitType: type },
        { merge: true }
      );
      setSelectedType(type);
    } catch (error) {
      Alert.alert('Error', 'Failed to save selection');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Split Items By</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleOptionPress('Percentage')}
        >
          <Text style={styles.optionText}>Percentage</Text>
          {selectedType === 'Percentage' && (
            <Ionicons name="checkmark" size={24} color="green" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => handleOptionPress('Share')}
        >
          <Text style={styles.optionText}>Share</Text>
          {selectedType === 'Share' && (
            <Ionicons name="checkmark" size={24} color="green" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  option: {
    backgroundColor: '#f2eaea',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
