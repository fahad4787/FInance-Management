import { FiFileText } from 'react-icons/fi';
import DataTable from './DataTable';

import { formatMoney } from '../utils/format';

const recurringMonthsToLabel = {
  3: '3 months',
  6: '6 months',
  12: '12 months',
  24: '24 months',
  36: '36 months'
};

const ExpenseTable = ({ expenses, onDelete, onEdit, isLoading = false, title = 'Expense Details', additionalFilters = null, hideFilters = [] }) => {
  const columns = [
    { key: 'expenseName', label: 'Expense Name' },
    { key: 'date', label: 'Date' },
    {
      key: 'expenseType',
      label: 'Type',
      render: (value, row) => {
        if (!value) return '-';
        const typeLabels = {
          'rent': 'Rent',
          'salaries': 'Salaries',
          'general': 'General',
          'fh': 'FH',
          'software_tool': 'Software Tool'
        };
        const typeColors = {
          'rent': 'bg-red-100 text-red-800',
          'salaries': 'bg-blue-100 text-blue-800',
          'general': 'bg-gray-100 text-gray-800',
          'fh': 'bg-amber-100 text-amber-800',
          'software_tool': 'bg-violet-100 text-violet-800'
        };
        let label = typeLabels[value?.toLowerCase()] || value;
        if (value?.toLowerCase() === 'software_tool' && row.recurring && row.recurringMonths) {
          const period = recurringMonthsToLabel[row.recurringMonths] ?? `${row.recurringMonths} months`;
          label = `Software Tool (${period})`;
        }
        const colorClass = typeColors[value?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${colorClass}`}>
            {label}
          </span>
        );
      }
    },
    { key: 'amount', label: 'Amount', render: (v) => formatMoney(v) },
    { key: 'comment', label: 'Comment/Remark' }
  ];

  const searchConfig = {
    enabled: true,
    placeholder: 'Search by expense name, type, comment...',
    searchFields: ['expenseName', 'expenseType', 'comment', 'date']
  };

  const allFilters = [
    {
      key: 'expenseType',
      label: 'Type',
      type: 'searchable',
      placeholder: 'All Types',
      icon: <FiFileText className="w-5 h-5 text-gray-400" />
    }
  ];
  const filters = hideFilters.length ? allFilters.filter((f) => !hideFilters.includes(f.key)) : allFilters;

  return (
    <DataTable
      data={expenses}
      columns={columns}
      title={title}
      isLoading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      searchConfig={searchConfig}
      filters={filters}
      additionalFilters={additionalFilters}
      pagination={{ enabled: true, itemsPerPage: 5 }}
    />
  );
};

export default ExpenseTable;
