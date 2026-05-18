import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiRepeat, FiTrendingDown, FiDollarSign, FiInbox, FiLayout, FiLogOut } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import { isApproved } from '../constants/app';

const Sidebar = ({ isOpen = true, isDesktop = true, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const transactions = useSelector((state) => state.transactions.items) || [];
  const expenses = useSelector((state) => state.expenses.items) || [];
  const projects = useSelector((state) => state.projects.items) || [];
  const pendingCount = [transactions, expenses, projects].reduce(
    (sum, list) => sum + list.filter((item) => !isApproved(item)).length,
    0
  );

  useEffect(() => {
    if (!isDesktop) onClose?.();
  }, [location.pathname, isDesktop, onClose]);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/projects', label: 'Projects', icon: <FiFileText className="w-5 h-5" /> },
    { path: '/transactions', label: 'Transactions', icon: <FiRepeat className="w-5 h-5" /> },
    { path: '/expenses', label: 'Expenses', icon: <FiTrendingDown className="w-5 h-5" /> },
    { path: '/pending', label: 'Pending', icon: <FiInbox className="w-5 h-5" />, badge: pendingCount },
    { path: '/impact-fund', label: 'Impact Fund', icon: <FiDollarSign className="w-5 h-5" /> },
    { path: '/allocation', label: 'Allocation', icon: <FiLayout className="w-5 h-5" /> }
  ];

  const showLabels = isOpen;
  const asideClass = isDesktop
    ? `fixed left-0 top-0 h-full z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`
    : `fixed left-0 top-0 h-full z-50 w-64 max-w-[85vw] transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
      }`;

  return (
    <aside className={asideClass} aria-hidden={!isOpen}>
      <div className="h-full flex flex-col bg-slate-800 shadow-xl border-r border-slate-700/50 overscroll-contain">
        <div className={`p-6 border-b border-slate-700/50 shrink-0 ${showLabels ? '' : 'opacity-0'} transition-opacity duration-300`}>
          <Link to="/" className="flex items-center" onClick={() => !isDesktop && onClose?.()}>
            <Logo variant="light" />
          </Link>
        </div>

        <nav
          className={`flex-1 p-4 space-y-1 overflow-y-auto ${showLabels ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const count = item.badge ?? 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => !isDesktop && onClose?.()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-400 border-l-4 border-primary-500'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
              >
                {item.icon}
                {showLabels && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {count > 0 && (
                      <span className="min-w-[1.25rem] px-1.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {count}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-slate-700/50 shrink-0 ${showLabels ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            {showLabels && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
