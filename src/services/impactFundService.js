import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const getAllWithdrawals = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'impactFundWithdrawals'));
    const withdrawals = [];
    querySnapshot.forEach((d) => {
      withdrawals.push({ id: d.id, ...d.data() });
    });
    return withdrawals.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    console.error('Error loading Impact Fund withdrawals:', error);
    throw error;
  }
};

export const addWithdrawal = async (withdrawalData) => {
  try {
    const dataWithTimestamp = {
      amount: Number(withdrawalData.amount) || 0,
      description: withdrawalData.description ?? '',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'impactFundWithdrawals'), dataWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error saving Impact Fund withdrawal:', error);
    throw error;
  }
};

export const updateWithdrawal = async (withdrawalId, withdrawalData) => {
  try {
    const data = {
      amount: Number(withdrawalData.amount) || 0,
      description: withdrawalData.description ?? '',
      updatedAt: new Date().toISOString()
    };
    await updateDoc(doc(db, 'impactFundWithdrawals', withdrawalId), data);
  } catch (error) {
    console.error('Error updating Impact Fund withdrawal:', error);
    throw error;
  }
};

export const deleteWithdrawal = async (withdrawalId) => {
  try {
    await deleteDoc(doc(db, 'impactFundWithdrawals', withdrawalId));
  } catch (error) {
    console.error('Error deleting Impact Fund withdrawal:', error);
    throw error;
  }
};
