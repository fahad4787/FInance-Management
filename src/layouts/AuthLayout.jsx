import { Outlet } from 'react-router-dom';
import Logo from '../components/Logo';

const AuthLayout = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-primary-50/40 to-blue-50">
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
