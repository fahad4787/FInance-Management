import { Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import AuthFeaturePanel from '../components/auth/AuthFeaturePanel';
import AuthMobileFeatures from '../components/auth/AuthMobileFeatures';
import '../styles/auth.css';

const AuthLayout = () => (
  <div className="min-h-screen min-h-[100dvh] flex flex-col lg:flex-row w-full bg-slate-100 isolate">
    <AuthFeaturePanel />

    <div className="flex-1 flex flex-col min-w-0 bg-slate-100 lg:bg-white">
      <div className="flex-1 flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 w-full max-w-md mx-auto lg:max-w-lg">
        <div className="lg:hidden flex justify-center mb-5 auth-enter">
          <Logo />
        </div>

        <AuthMobileFeatures />

        <div className="auth-enter w-full min-w-0" style={{ animationDelay: '0.05s' }}>
          <Outlet />
        </div>

        <p className="mt-5 text-center text-[11px] sm:text-xs text-slate-500">
          Secure sign-in · Projects · Transactions · Impact Fund
        </p>
      </div>
    </div>
  </div>
);

export default AuthLayout;
