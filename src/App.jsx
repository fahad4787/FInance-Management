import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from './contexts/AuthContext';
import { db } from './firebase';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Loader from './components/Loader';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Transactions from './pages/Transactions';
import Expenses from './pages/Expenses';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';

function AppRoutes() {
  const { user, loading } = useAuth();
  const [hasAccountCheck, setHasAccountCheck] = useState({ loading: true, hasUsers: false });

  useEffect(() => {
    if (user) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'app', 'config'));
        if (!cancelled) setHasAccountCheck({ loading: false, hasUsers: snap.exists() && !!snap.data()?.hasUsers });
      } catch {
        if (!cancelled) setHasAccountCheck({ loading: false, hasUsers: false });
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader />
      </div>
    );
  }

  if (!user) {
    if (hasAccountCheck.loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <Loader />
        </div>
      );
    }
    return (
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={hasAccountCheck.hasUsers ? <Login /> : <Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="expenses" element={<Expenses />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
