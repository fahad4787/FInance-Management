import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const TARGET_AMOUNT_FIELD = 'targetAmount';

export const getTargetAmount = async (userId) => {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    const value = snap.exists() ? snap.data()[TARGET_AMOUNT_FIELD] : undefined;
    return value !== undefined && value !== null && Number.isFinite(Number(value)) ? Number(value) : null;
  } catch (error) {
    console.error('Error loading target amount:', error);
    return null;
  }
};

export const setTargetAmount = async (userId, amount) => {
  if (!userId) throw new Error('User ID required');
  const userRef = doc(db, 'users', userId);
  const value = amount === '' || amount === null || amount === undefined ? null : Math.max(0, Number(amount) || 0);
  await updateDoc(userRef, { [TARGET_AMOUNT_FIELD]: value });
  return value;
};
