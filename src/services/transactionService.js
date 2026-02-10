import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ENTRY_STATUS } from '../constants/app';

export const getAllTransactions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'transactions'));
    const transactions = [];
    querySnapshot.forEach((d) => {
      transactions.push({ id: d.id, ...d.data() });
    });
    return transactions;
  } catch (error) {
    console.error('Error loading transactions:', error);
    throw error;
  }
};

export const saveTransaction = async (transactionData) => {
  try {
    const createdBy = transactionData.createdBy ?? null;
    const status = createdBy ? ENTRY_STATUS.PENDING : ENTRY_STATUS.APPROVED;
    const dataWithTimestamp = {
      ...transactionData,
      createdBy,
      status,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'transactions'), dataWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

export const updateTransaction = async (transactionId, transactionData) => {
  try {
    const payload = { ...transactionData, updatedAt: new Date().toISOString() };
    await updateDoc(doc(db, 'transactions', transactionId), payload);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const approveTransaction = async (transactionId, approvedBy) => {
  try {
    await updateDoc(doc(db, 'transactions', transactionId), {
      status: ENTRY_STATUS.APPROVED,
      approvedBy,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error approving transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, 'transactions', transactionId));
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

