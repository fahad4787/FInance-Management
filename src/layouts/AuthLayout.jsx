import { Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import AuthFeaturePanel from '../components/auth/AuthFeaturePanel';
import AuthMobileFeatures from '../components/auth/AuthMobileFeatures';
import '../styles/auth.css';

const AuthLayout = () => (
  <div className="min-h-screen min-h-[100dvh] flex flex-col lg:flex-row w-full bg-slate-100 isolate">
    <AuthFeaturePanel />

    <div className="flex-1 flex flex-col min-w-0 min-h-[100dvh] lg:min-h-0 bg-white lg:justify-center">
      {/* Mobile: form first */}
      <div
        className="flex-1 flex flex-col justify-center min-h-0 px-4 py-5 sm:px-8 sm:py-8 w-full max-w-md mx-auto lg:max-w-lg lg:py-10 min-w-0 auth-enter"
        style={{ animationDelay: '0.05s' }}
      >
        <div className="lg:hidden flex justify-center mb-5">
          <Logo />
        </div>
        <Outlet />
      </div>

      {/* Mobile: features below form */}
      <div className="lg:hidden mt-auto bg-emerald-900 border-t border-emerald-950 px-4 py-5 sm:px-6 sm:py-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] auth-enter shrink-0 w-full">
        <p className="text-center text-emerald-100/90 text-sm leading-relaxed max-w-sm mx-auto mb-4">
          Your finance operations hub
        </p>
        <AuthMobileFeatures />
      </div>
    </div>
  </div>
);

export default AuthLayout;
