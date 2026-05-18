import {
  FiHome,
  FiFileText,
  FiRepeat,
  FiTrendingDown,
  FiPieChart,
  FiShield
} from 'react-icons/fi';

export const AUTH_FEATURES = [
  {
    id: 'overview',
    icon: FiHome,
    title: 'Clear financial picture',
    description: 'See the metrics that matter most in a simple, focused workspace.',
    stat: 'At a glance'
  },
  {
    id: 'projects',
    icon: FiFileText,
    title: 'Stay on top of work',
    description: 'Keep project details organized and easy to find when you need them.',
    stat: 'Organized'
  },
  {
    id: 'activity',
    icon: FiRepeat,
    title: 'Track money in and out',
    description: 'Record and review activity with search and date filters built in.',
    stat: 'Full history'
  },
  {
    id: 'expenses',
    icon: FiTrendingDown,
    title: 'Manage spending',
    description: 'Capture expenses with notes and categories for cleaner reporting.',
    stat: 'On record'
  },
  {
    id: 'reports',
    icon: FiPieChart,
    title: 'Visual summaries',
    description: 'Charts and summaries help you spot patterns without digging through spreadsheets.',
    stat: 'Insights'
  },
  {
    id: 'secure',
    icon: FiShield,
    title: 'Secure access',
    description: 'Sign in to your private workspace. Only authorized users can view your data.',
    stat: 'Protected'
  }
];
