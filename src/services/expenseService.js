import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const getAllExpenses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'expenses'));
    const expenses = [];
    querySnapshot.forEach((d) => {
      expenses.push({ id: d.id, ...d.data() });
    });
    return expenses;
  } catch (error) {
    console.error('Error loading expenses:', error);
    throw error;
  }
};

export const saveExpense = async (expenseData) => {
  try {
    const dataWithTimestamp = {
      ...expenseData,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'expenses'), dataWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
};

export const updateExpense = async (expenseId, expenseData) => {
  try {
    await updateDoc(doc(db, 'expenses', expenseId), {
      ...expenseData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};
