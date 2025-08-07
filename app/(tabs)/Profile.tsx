import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from '@/lib/firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

const avatarMap: Record<string, any> = {
  avatar1: require('@/assets/images/avatar1.png'),
  avatar2: require('@/assets/images/avatar2.png'),
  avatar3: require('@/assets/images/avatar3.png'),
  avatar4: require('@/assets/images/avatar4.png'),
  avatar5: require('@/assets/images/avatar5.png'),
};

const avatarOptions = Object.keys(avatarMap);

interface Member {
  id: string;
  name: string;
  balance: number;
  avatar?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [settleModalVisible, setSettleModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const fetchMembers = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const ref = collection(db, 'users', uid, 'groupMembers');
    const snapshot = await getDocs(ref);
    const memberList: Member[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || 'Unnamed',
      balance: doc.data().balance || 0,
      avatar: doc.data().avatar || 'avatar1',
    }));

    setMembers(memberList);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAvatarChange = async (newAvatar: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid || !selectedMemberId) return;

    const docRef = doc(db, 'users', uid, 'groupMembers', selectedMemberId);
    await updateDoc(docRef, { avatar: newAvatar });

    setAvatarModalVisible(false);
    fetchMembers();
  };

  const totalBalance = members.reduce((sum, m) => sum + m.balance, 0);

  const renderMemberRow = (member: Member) => (
    <View key={member.id} style={styles.memberRow}>
      <View style={styles.avatarNameContainer}>
        <TouchableOpacity
          onPress={() => {
            setSelectedMemberId(member.id);
            setAvatarModalVisible(true);
          }}
        >
          <Image
            source={avatarMap[member.avatar || 'avatar1']}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
        <Text style={styles.memberName}>{member.name}</Text>
      </View>
      <Text
        style={[
          styles.balance,
          { color: member.balance < 0 ? 'red' : 'green' },
        ]}
      >
        ${member.balance.toFixed(2)}
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

        <ScrollView style={{ maxHeight: 420 }}>
          {members.map(renderMemberRow)}
        </ScrollView>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Balance:</Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color:
                totalBalance < 0 ? 'red' : totalBalance > 0 ? 'green' : '#333',
            }}
          >
            ${totalBalance.toFixed(2)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.settleButton}
        onPress={() => setSettleModalVisible(true)}
      >
        <Text style={styles.settleButtonText}>Settle Up</Text>
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
                router.push('/suggestPayments');
              }}
            >
              <Text style={styles.settleButtonText}>Suggest Payments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Avatar Selection Modal */}
      <Modal visible={avatarModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.avatarModal}>
            <Text style={styles.modalTitle}>Choose an Avatar</Text>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((avatar) => (
                <TouchableOpacity
                  key={avatar}
                  onPress={() => handleAvatarChange(avatar)}
                >
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
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
    color: '#444',
  },
  card: {
    backgroundColor: '#f2eeee',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  settleButton: {
    backgroundColor: '#50e3c2',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  settleButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  settleContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 40,
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
  avatarModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarOption: {
    width: 60,
    height: 60,
    margin: 8,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ccc',
  },
});
