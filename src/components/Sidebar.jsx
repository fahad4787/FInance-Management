import { memo, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiRepeat, FiTrendingDown, FiDollarSign, FiInbox, FiLayout, FiLogOut } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import { isApproved } from '../constants/app';
import {
  sidebarShellClass,
  sidebarSectionBorderClass,
  sidebarNavLinkBase,
  sidebarNavLinkActive,
  sidebarNavLinkInactive,
  sidebarBadgeClass,
  sidebarLogoutClass
} from '../constants/sidebarTheme';

const Sidebar = ({ isOpen = true, isDesktop = true, onClose, motionClass = '' }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const transactions = useSelector((state) => state.transactions.items);
  const expenses = useSelector((state) => state.expenses.items);
  const projects = useSelector((state) => state.projects.items);

  const pendingCount = useMemo(
    () =>
      [transactions, expenses, projects].reduce(
        (sum, list) => sum + (list || []).filter((item) => !isApproved(item)).length,
        0
      ),
    [transactions, expenses, projects]
  );

  useEffect(() => {
    if (!isDesktop) onClose?.();
  }, [location.pathname, isDesktop, onClose]);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome className="w-5 h-5 shrink-0" /> },
    { path: '/projects', label: 'Projects', icon: <FiFileText className="w-5 h-5 shrink-0" /> },
    { path: '/transactions', label: 'Transactions', icon: <FiRepeat className="w-5 h-5 shrink-0" /> },
    { path: '/expenses', label: 'Expenses', icon: <FiTrendingDown className="w-5 h-5 shrink-0" /> },
    { path: '/pending', label: 'Pending', icon: <FiInbox className="w-5 h-5 shrink-0" />, badge: pendingCount },
    { path: '/impact-fund', label: 'Impact Fund', icon: <FiDollarSign className="w-5 h-5 shrink-0" /> },
    { path: '/allocation', label: 'Allocation', icon: <FiLayout className="w-5 h-5 shrink-0" /> }
  ];

  const asideClass = `fixed left-0 top-0 z-50 h-full w-64 max-w-[85vw] ${motionClass} ${
    isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
  }`;

  return (
    <aside className={asideClass} aria-hidden={!isOpen}>
      <div className={`${sidebarShellClass} h-full [transform:translateZ(0)]`}>
        <div className={`p-5 sm:p-6 border-b ${sidebarSectionBorderClass} shrink-0`}>
          <Link to="/" className="flex items-center" onClick={() => !isDesktop && onClose?.()}>
            <Logo variant="light" />
          </Link>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const count = item.badge ?? 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => !isDesktop && onClose?.()}
                className={`${sidebarNavLinkBase} ${isActive ? sidebarNavLinkActive : sidebarNavLinkInactive}`}
              >
                {item.icon}
                <span className="flex-1 truncate">{item.label}</span>
                {count > 0 && <span className={sidebarBadgeClass}>{count}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`p-3 sm:p-4 border-t ${sidebarSectionBorderClass} shrink-0`}>
          <button type="button" onClick={logout} aria-label="Sign out" className={sidebarLogoutClass}>
            <FiLogOut className="w-5 h-5 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
