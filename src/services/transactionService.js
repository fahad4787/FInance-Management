import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
    const dataWithTimestamp = {
      ...transactionData,
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
    await updateDoc(doc(db, 'transactions', transactionId), {
      ...transactionData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
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

