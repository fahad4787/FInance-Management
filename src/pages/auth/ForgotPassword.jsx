import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import AuthCard from '../../components/AuthCard';
import ErrorAlert from '../../components/ErrorAlert';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Reset password | FinHub';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      const code = err.code;
      let message = 'Failed to send reset email.';
      if (code === 'auth/user-not-found') message = 'No account found for this email.';
      else if (code === 'auth/too-many-requests') message = 'Too many attempts. Please try again later.';
      else if (code === 'auth/network-request-failed') message = 'Network error. Check your connection.';
      else if (err.message) message = err.message;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Reset password">
      <form onSubmit={handleSubmit} className="space-y-5">
        <ErrorAlert message={error} />
        {success && (
          <div className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800" role="status">
            Check your email for a link to reset your password.
          </div>
        )}
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          icon={<FiMail className="w-5 h-5 text-gray-400" />}
        />
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Sending...' : 'Send reset link'}
        </Button>
        <p className="text-center text-sm text-slate-600">
          <Link to="/" className="font-semibold text-primary-600 hover:text-primary-700">
            Back to Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default ForgotPassword;
