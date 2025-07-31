import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../lib/firebase";

interface Member {
  id: number;
  name: string;
  isEditing: boolean;
}

export default function AddGroupMember() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const loadMembers = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const groupDoc = doc(db, "users", uid, "groups", "default");
      const groupSnap = await getDoc(groupDoc);

      if (groupSnap.exists()) {
        const savedMembers = groupSnap.data().members;
        setMembers(savedMembers);
      } else {
        const defaultMembers = [
          { id: 1, name: "Member 1", isEditing: false },
          { id: 2, name: "Member 2", isEditing: false },
          { id: 3, name: "Member 3", isEditing: false },
          { id: 4, name: "Member 4", isEditing: false },
        ];
        setMembers(defaultMembers);
        await setDoc(groupDoc, { members: defaultMembers });
      }
    };

    loadMembers();
  }, []);

  const updateMembersInFirestore = async (updatedMembers: Member[]) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const groupDoc = doc(db, "users", uid, "groups", "default");
    await updateDoc(groupDoc, { members: updatedMembers });
  };

  const handleEdit = (id: number) => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, isEditing: true } : m
    );
    setMembers(updated);
  };

  const handleChange = (id: number, newName: string) => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, name: newName } : m
    );
    setMembers(updated);
    updateMembersInFirestore(updated);
  };

  const handleBlur = (id: number) => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, isEditing: false } : m
    );
    setMembers(updated);
    updateMembersInFirestore(updated);
  };

  const handleAddMember = () => {
    const newMember: Member = {
      id: members.length + 1,
      name: `Member ${members.length + 1}`,
      isEditing: false,
    };
    const updated = [...members, newMember];
    setMembers(updated);
    updateMembersInFirestore(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Group Member</Text>

      <ScrollView style={styles.listContainer}>
        {members.map((member) => (
          <TouchableOpacity
            key={member.id}
            style={styles.memberItem}
            onPress={() => handleEdit(member.id)}
            activeOpacity={0.7}
          >
            {member.isEditing ? (
              <TextInput
                value={member.name}
                autoFocus
                style={styles.input}
                onChangeText={(text) => handleChange(member.id, text)}
                onBlur={() => handleBlur(member.id)}
                onSubmitEditing={() => {
                  handleBlur(member.id);
                  Keyboard.dismiss();
                }}
              />
            ) : (
              <Text style={styles.memberText}>{member.name}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
        <Text style={styles.addButtonText}>Add More Member</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
  },
  memberItem: {
    backgroundColor: "#f2eaea",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  memberText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    fontSize: 18,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "100%",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButton: {
    marginTop: 30,
    backgroundColor: "turquoise",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  addButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});