import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from './contexts/AuthContext';
import { db } from './firebase';
import { MAX_USERS } from './constants/app';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Loader from './components/Loader';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Transactions from './pages/Transactions';
import Expenses from './pages/Expenses';
import PendingRequests from './pages/PendingRequests';
import ImpactFund from './pages/ImpactFund';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';

function AppRoutes() {
  const { user, loading } = useAuth();
  const [authConfig, setAuthConfig] = useState({ loading: true, userCount: 0 });

  useEffect(() => {
    if (user) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'app', 'config'));
        const data = snap.exists() ? snap.data() : {};
        const hasUsers = !!data.hasUsers;
        const userCount = data.userCount ?? (hasUsers ? 1 : 0);
        if (!cancelled) setAuthConfig({ loading: false, userCount });
      } catch {
        if (!cancelled) setAuthConfig({ loading: false, userCount: 0 });
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
    if (authConfig.loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <Loader />
        </div>
      );
    }
    const showSignup = authConfig.userCount < MAX_USERS;
    return (
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={authConfig.userCount === 0 ? <Signup /> : <Login showSignupLink={showSignup} />} />
          {showSignup && <Route path="signup" element={<Signup />} />}
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
        <Route path="pending" element={<PendingRequests />} />
        <Route path="impact-fund" element={<ImpactFund />} />
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
