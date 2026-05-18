import {
  FiHome,
  FiFileText,
  FiRepeat,
  FiTrendingDown,
  FiInbox,
  FiDollarSign,
  FiLayout
} from 'react-icons/fi';

export const AUTH_FEATURES = [
  {
    id: 'dashboard',
    icon: FiHome,
    title: 'Financial overview',
    description: 'Track available balance, active projects, monthly trends, and target progress in one place.',
    stat: 'Live dashboard'
  },
  {
    id: 'projects',
    icon: FiFileText,
    title: 'Project intelligence',
    description: 'Manage brokers, hourly rates, taxes, and 3-month onboard vs ended activity at a glance.',
    stat: 'Full lifecycle'
  },
  {
    id: 'transactions',
    icon: FiRepeat,
    title: 'Transaction control',
    description: 'Record inward with brokerage, generate missing entries, and filter by broker or date range.',
    stat: 'Smart generate'
  },
  {
    id: 'expenses',
    icon: FiTrendingDown,
    title: 'Expense tracking',
    description: 'Log one-time and recurring costs with types, comments, and period-based reporting.',
    stat: 'Recurring ready'
  },
  {
    id: 'pending',
    icon: FiInbox,
    title: 'Partner approvals',
    description: 'Dual-account workflow — submit entries and approve each other\'s transactions, expenses, and projects.',
    stat: 'Two-user sync'
  },
  {
    id: 'impact',
    icon: FiDollarSign,
    title: 'Impact Fund',
    description: 'Automatic 2% withholding per transaction with contribution history and withdrawal tracking.',
    stat: '2% auto-save'
  },
  {
    id: 'allocation',
    icon: FiLayout,
    title: 'Project allocation',
    description: 'Visualize inward vs total cost across projects with brokerage, tax, and project cost breakdown.',
    stat: 'Cost insights'
  }
];
