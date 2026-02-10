import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { MAX_USERS } from '../constants/app';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ensureUserDoc = async (u) => {
    if (!u) return;
    const userRef = doc(db, 'users', u.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: u.email ?? '',
        createdAt: serverTimestamp()
      });
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await ensureUserDoc(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signup = async (email, password) => {
    const configRef = doc(db, 'app', 'config');
    const configSnap = await getDoc(configRef);
    const data = configSnap.exists() ? configSnap.data() : {};
    const userCount = data.userCount ?? (data.hasUsers ? 1 : 0);
    if (userCount >= MAX_USERS) {
      const err = new Error('Maximum number of accounts reached.');
      err.code = 'auth/max-users';
      throw err;
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const u = userCredential.user;
    await setDoc(doc(db, 'users', u.uid), {
      email: u.email ?? '',
      createdAt: serverTimestamp()
    });
    await setDoc(configRef, {
      hasUsers: true,
      userCount: userCount + 1
    }, { merge: true });
    return userCredential;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
