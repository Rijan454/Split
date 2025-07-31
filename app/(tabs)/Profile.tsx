import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Member {
  id: string;
  name: string;
  balance: number;
  isEditing: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Member 1', balance: 0, isEditing: false },
    { id: '2', name: 'Member 2', balance: 0, isEditing: false },
    { id: '3', name: 'Member 3', balance: 0, isEditing: false },
    { id: '4', name: 'Member 4', balance: 0, isEditing: false },
  ]);

  const [settleModalVisible, setSettleModalVisible] = useState(false);

  const addMember = () => {
    const newId = (members.length + 1).toString();
    setMembers([
      ...members,
      { id: newId, name: `Member ${newId}`, balance: 0, isEditing: false },
    ]);
  };

  const deleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleNameChange = (id: string, newName: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name: newName } : m))
    );
  };

  const toggleEdit = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isEditing: !m.isEditing } : { ...m, isEditing: false }
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profiles</Text>

      <View style={styles.memberList}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberRow}>
            {member.isEditing ? (
              <TextInput
                style={styles.input}
                value={member.name}
                onChangeText={(text) => handleNameChange(member.id, text)}
                onBlur={() => toggleEdit(member.id)}
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={() => toggleEdit(member.id)}>
                <Text style={styles.memberName}>{member.name}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.balance}>${member.balance.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => deleteMember(member.id)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={addMember}>
        <Text style={styles.buttonText}>More Member</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setSettleModalVisible(true)}
      >
        <Text style={styles.buttonText}>Settle Up</Text>
      </TouchableOpacity>

      {/* Settle Up Modal */}
      <Modal visible={settleModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.settleContainer}>
            <TouchableOpacity onPress={() => setSettleModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSettleModalVisible(false);
                router.push('/suggestPayments'); // Navigate to suggestPayments
              }}
            >
              <Text style={styles.buttonText}>Suggest Payments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
    color: '#888',
  },
  memberList: {
    backgroundColor: '#f0eaea',
    padding: 10,
    borderRadius: 10,
    marginBottom: 30,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    padding: 2,
  },
  button: {
    backgroundColor: '#50e3c2',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 40,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  settleContainer: {
    backgroundColor: '#f2eeee',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 40,
    justifyContent: 'center',
  },
  cancelText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#50e3c2',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
});