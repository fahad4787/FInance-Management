import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import InputField from '../../components/InputField';
import PasswordField from '../../components/PasswordField';
import Button from '../../components/Button';
import AuthCard from '../../components/AuthCard';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Sign in | FinHub';
  }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      const code = err.code;
      let message = 'Login failed.';
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found') message = 'Invalid email or password.';
      else if (code === 'auth/too-many-requests') message = 'Too many attempts. Please try again later.';
      else if (code === 'auth/network-request-failed') message = 'Network error. Check your connection.';
      else if (err.message) message = err.message;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Sign in">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}
        <InputField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter your email"
          icon={<FiMail className="w-5 h-5 text-gray-400" />}
        />
        <PasswordField
          label="Password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Enter password"
          leftIcon={<FiLock className="w-5 h-5 text-gray-400" />}
        />
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthCard>
  );
};

export default Login;
