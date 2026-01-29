import { FiFileText } from 'react-icons/fi';
import DataTable from './DataTable';

const formatMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return '-';
  return `$${n.toFixed(2)}`;
};

const ExpenseTable = ({ expenses, onDelete, onEdit, isLoading = false, title = 'Expense Details' }) => {
  const columns = [
    { key: 'expenseName', label: 'Expense Name' },
    { key: 'date', label: 'Date' },
    {
      key: 'expenseType',
      label: 'Type',
      render: (value) => {
        if (!value) return '-';
        const typeLabels = {
          'rent': 'Rent',
          'salaries': 'Salaries',
          'general': 'General'
        };
        const typeColors = {
          'rent': 'bg-red-100 text-red-800',
          'salaries': 'bg-blue-100 text-blue-800',
          'general': 'bg-gray-100 text-gray-800'
        };
        const label = typeLabels[value.toLowerCase()] || value;
        const colorClass = typeColors[value.toLowerCase()] || 'bg-gray-100 text-gray-800';
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

  const filters = [
    {
      key: 'expenseType',
      label: 'Type',
      type: 'searchable',
      placeholder: 'All Types',
      icon: <FiFileText className="w-5 h-5 text-gray-400" />
    }
  ];

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
      pagination={{ enabled: true, itemsPerPage: 5 }}
    />
  );
};

export default ExpenseTable;
