import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  StyleSheet, ScrollView, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from '@/lib/firebase';
import {
  collection, getDocs, updateDoc, doc
} from 'firebase/firestore';

const avatarMap: Record<string, any> = {
  avatar1: require('@/assets/images/avatar1.png'),
  avatar2: require('@/assets/images/avatar2.png'),
  avatar3: require('@/assets/images/avatar3.png'),
  avatar4: require('@/assets/images/avatar4.png'),
  avatar5: require('@/assets/images/avatar5.png'),
};

const avatarOptions = Object.keys(avatarMap);

interface Expense {
  title: string;
  amount: number;
  currency: string;
  date: string;
  by: string; // uid of payer
  byName: string;
  for: string[]; // uid of recipients
  forMemberNames: string[];
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  balance: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [settleModalVisible, setSettleModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const fetchDataAndCalculateBalances = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    // Fetch expenses
    const expensesSnapshot = await getDocs(collection(db, 'users', uid, 'expenses'));
    const expenses: Expense[] = expensesSnapshot.docs.map(doc => ({
      ...(doc.data() as Expense),
      amount: typeof doc.data().amount === 'number' ? doc.data().amount : parseFloat(doc.data().amount)
    }));

    const balanceMap: Record<string, number> = {};

    // Calculate balances
    expenses.forEach(expense => {
      const { by, amount, for: recipients } = expense;
      const share = amount / recipients.length;

      if (!balanceMap[by]) balanceMap[by] = 0;
      balanceMap[by] += amount;

      recipients.forEach(recipientId => {
        if (!balanceMap[recipientId]) balanceMap[recipientId] = 0;
        balanceMap[recipientId] -= share;
      });
    });

    // Fetch group members
    const groupSnapshot = await getDocs(collection(db, "users", uid, "groupMembers"));
    const members: Member[] = [];

    groupSnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const memberId = docSnap.id;
      const balance = balanceMap[memberId] || 0;

      members.push({
        id: memberId,
        name: data.name,
        avatar: data.avatar || "avatar1",
        balance: parseFloat(balance.toFixed(2)),
      });
    });

    setMembers(members);
  };

  useEffect(() => {
    fetchDataAndCalculateBalances();
  }, []);

  const totalBalance = members.reduce((sum, m) => sum + m.balance, 0);

  const handleAvatarChange = async (newAvatar: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid || !selectedMemberId) return;

    const ref = doc(db, 'users', uid, 'groupMembers', selectedMemberId);
    await updateDoc(ref, { avatar: newAvatar });

    setAvatarModalVisible(false);
    fetchDataAndCalculateBalances();
  };

  const renderMemberRow = (member: Member) => (
  <View key={member.id} style={styles.memberRow}>
    <View style={styles.avatarNameContainer}>
      <TouchableOpacity
        onPress={() => {
          setSelectedMemberId(member.id);
          setAvatarModalVisible(true);
        }}
      >
        <Image source={avatarMap[member.avatar || 'avatar1']} style={styles.avatarImage} />
      </TouchableOpacity>
      <Text style={styles.memberName}>{member.name}</Text>
    </View>
    <Text
      style={[
        styles.balance,
        { color: member.balance < 0 ? 'red' : member.balance > 0 ? 'green' : '#333' }
      ]}
    >
      ${Math.abs(member.balance).toFixed(2)}
    </Text>
  </View>
);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Group Members</Text>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={[styles.columnTitle, { flex: 1.5 }]}>Member</Text>
          <Text style={[styles.columnTitle, { flex: 1 }]}>Balance</Text>
        </View>

        <ScrollView style={{ maxHeight: 400 }}>
          {members.map(renderMemberRow)}
        </ScrollView>

        <View style={styles.totalRow}>
  <Text style={styles.totalLabel}>Total Balance:</Text>
  <Text style={{
    fontWeight: 'bold',
    fontSize: 16,
    color:
      totalBalance < -0.01
        ? 'red'
        : totalBalance > 0.01
        ? 'green'
        : '#333',
  }}>
    ${Math.abs(totalBalance).toFixed(2)}
  </Text>
</View>
      </View>

      <TouchableOpacity style={styles.settleButton} onPress={() => setSettleModalVisible(true)}>
        <Text style={styles.settleButtonText}>Settle Up</Text>
      </TouchableOpacity>

      {/* Settle Modal */}
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
                router.push('/suggestPayments');
              }}
            >
              <Text style={styles.settleButtonText}>Suggest Payments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Avatar Modal */}
      <Modal visible={avatarModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.avatarModal}>
            <Text style={styles.modalTitle}>Choose an Avatar</Text>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((avatar) => (
                <TouchableOpacity key={avatar} onPress={() => handleAvatarChange(avatar)}>
                  <Image source={avatarMap[avatar]} style={styles.avatarOption} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, alignSelf: 'center' },
  card: { backgroundColor: '#f4f4f4', borderRadius: 12, padding: 16, elevation: 4 },
  headerRow: { flexDirection: 'row', marginBottom: 10 },
  columnTitle: { fontWeight: 'bold', fontSize: 16 },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  avatarNameContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 40, height: 40, borderRadius: 20, marginRight: 10,
  },
  memberName: { fontSize: 16 },
  balance: {
    flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#aaa',
  },
  totalLabel: { fontWeight: 'bold', fontSize: 16 },
  settleButton: {
    backgroundColor: '#2e86de',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  settleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settleContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButton: {
    marginTop: 12,
    backgroundColor: '#2e86de',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: { fontSize: 16, color: '#444', marginTop: 10 },
  avatarModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  avatarOption: {
    width: 60, height: 60, borderRadius: 30, margin: 6,
  },
});