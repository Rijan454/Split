

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../lib/firebase";

interface Member {
  id: string;
  name: string;
  isEditing: boolean;
}

export default function AddGroupMember() {
  const [members, setMembers] = useState<Member[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const loadData = async () => {
      const memberSnap = await getDocs(collection(db, "users", uid, "groupMembers"));
      const groupDoc = await getDoc(doc(db, "users", uid, "group", "groupInfo"));

      const loaded: Member[] = memberSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        isEditing: false,
      }));
      setMembers(loaded);

      if (groupDoc.exists()) {
        setGroupName(groupDoc.data().name || "");
      }
    };

    loadData();
  }, [uid]);

  const updateMemberName = async (id: string, newName: string) => {
    if (!uid) return;
    await updateDoc(doc(db, "users", uid, "groupMembers", id), { name: newName });
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name: newName } : m))
    );
  };

  const handleAddMember = async () => {
    if (!uid) return;

    const newDoc = await addDoc(collection(db, "users", uid, "groupMembers"), {
      name: `Member ${members.length + 1}`,
      createdAt: Timestamp.now(),
    });

    setMembers((prev) => [
      ...prev,
      { id: newDoc.id, name: `Member ${members.length + 1}`, isEditing: false },
    ]);
  };

  const handleDelete = async (id: string) => {
    if (!uid) return;
    await deleteDoc(doc(db, "users", uid, "groupMembers", id));
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSaveGroupName = async () => {
    if (!uid || groupName.trim() === "") return;
    const groupRef = doc(db, "users", uid, "group", "groupInfo");
    await setDoc(groupRef, { name: groupName });
    setIsModalVisible(false);
    Alert.alert("Success", "Group name saved!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/createGroup")}> 
        <Ionicons name="chevron-back" size={32} color="#000" />
      </TouchableOpacity>

      <Text style={styles.heading}>Add Group Members</Text>

      {groupName ? (
        <View style={styles.groupNameRow}>
          <Text style={styles.groupNameText}>Group: {groupName}</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Ionicons name="create-outline" size={20} color="#1abc9c" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#1abc9c" }]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.buttonText}>Name Your Group</Text>
        </TouchableOpacity>
      )}

      {members.map((member) => (
        <View key={member.id} style={styles.memberRow}>
          <View style={styles.avatar}>
            <Text style={{ fontWeight: "bold", color: "#000" }}>
              {member.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          {member.isEditing ? (
            <TextInput
              style={styles.input}
              value={member.name}
              autoFocus
              onChangeText={(text) => updateMemberName(member.id, text)}
              onBlur={() =>
                setMembers((prev) =>
                  prev.map((m) =>
                    m.id === member.id ? { ...m, isEditing: false } : m
                  )
                )
              }
            />
          ) : (
            <TouchableOpacity
              style={styles.nameBox}
              onPress={() =>
                setMembers((prev) =>
                  prev.map((m) =>
                    m.id === member.id ? { ...m, isEditing: true } : m
                  )
                )
              }
            >
              <Text style={styles.nameText}>{member.name}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => handleDelete(member.id)}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleAddMember}>
        <Text style={styles.buttonText}>Add More Member</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1abc9c" }]}
        onPress={() => router.push("/(tabs)/Profile")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={isModalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter Group Name</Text>
            <TextInput
              style={styles.modalInput}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="e.g. Trip, Flatmates, Event"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSaveGroupName}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Save Group Name</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 10,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  groupNameRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  groupNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2eaea",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  avatar: {
    backgroundColor: "#1de9b6",
    height: 35,
    width: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  nameBox: {
    flex: 1,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#33e3d3",
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    margin: 30,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: "#1abc9c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});