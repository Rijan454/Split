import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase"; // Adjust path if needed

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
    updateMembersInFirestore(updated); // Save to Firestore
  };

  const handleBlur = (id: number) => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, isEditing: false } : m
    );
    setMembers(updated);
    updateMembersInFirestore(updated); // Save on blur
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
    <div style={{ padding: 20 }}>
      <h2>addGroupMember</h2>

      <div style={{ marginTop: 20 }}>
        {members.map((member) => (
          <div
            key={member.id}
            style={{
              backgroundColor: "#f2eaea",
              padding: 15,
              margin: "10px 0",
              textAlign: "center",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => handleEdit(member.id)}
          >
            {member.isEditing ? (
              <input
                type="text"
                autoFocus
                value={member.name}
                onChange={(e) => handleChange(member.id, e.target.value)}
                onBlur={() => handleBlur(member.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleBlur(member.id);
                }}
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  borderRadius: 5,
                  padding: 5,
                }}
              />
            ) : (
              member.name
            )}
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: 40,
          backgroundColor: "turquoise",
          color: "black",
          padding: "10px 20px",
          borderRadius: 20,
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleAddMember}
      >
        Add More member
      </button>
    </div>
  );
}
