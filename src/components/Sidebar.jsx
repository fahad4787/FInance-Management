import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiRepeat, FiTrendingDown, FiDollarSign, FiInbox, FiLogOut } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import { isApproved } from '../constants/app';

const Sidebar = ({ isOpen = true }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const transactions = useSelector((state) => state.transactions.items) || [];
  const expenses = useSelector((state) => state.expenses.items) || [];
  const projects = useSelector((state) => state.projects.items) || [];
  const pendingCount = [transactions, expenses, projects].reduce(
    (sum, list) => sum + list.filter((item) => !isApproved(item)).length,
    0
  );

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/projects', label: 'Projects', icon: <FiFileText className="w-5 h-5" /> },
    { path: '/transactions', label: 'Transactions', icon: <FiRepeat className="w-5 h-5" /> },
    { path: '/expenses', label: 'Expenses', icon: <FiTrendingDown className="w-5 h-5" /> },
    { path: '/pending', label: 'Pending', icon: <FiInbox className="w-5 h-5" />, badge: pendingCount },
    { path: '/impact-fund', label: 'Impact Fund', icon: <FiDollarSign className="w-5 h-5" /> }
  ];

  return (
    <div
      className={`bg-white shadow-lg border-r border-gray-200 fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className={`p-6 border-b border-gray-200 ${!isOpen ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
        </div>
        
        <nav className={`flex-1 p-4 space-y-2 ${!isOpen ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const count = item.badge ?? 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                {item.icon}
                {isOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {count > 0 && (
                      <span className="min-w-[1.25rem] px-1.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
                        {count}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
        <div className={`p-4 border-t border-gray-200 ${!isOpen ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            {isOpen && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
