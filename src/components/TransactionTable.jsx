import { FiUser, FiFileText } from 'react-icons/fi';
import DataTable from './DataTable';

const formatMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return '-';
  return `$${n.toFixed(2)}`;
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const computeNetTotal = (t) => {
  const amount = toNumber(t.amount);
  const brokerageAmount = toNumber(t.brokerageAmount);
  const additionalCharges = toNumber(t.additionalCharges);
  return amount - brokerageAmount - additionalCharges;
};

const TransactionTable = ({ transactions, onDelete, onEdit, isLoading = false, title = 'Transaction Details' }) => {
  const columns = [
    { key: 'client', label: 'Broker' },
    { key: 'project', label: 'Project Name' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (v) => formatMoney(v) },
    {
      key: 'brokerageDisplay',
      label: 'Brokerage',
      render: (_, t) => {
        if (t.brokerageType === 'percentage') return `${t.brokerageValue || 0}%`;
        return formatMoney(t.brokerageValue);
      }
    },
    { key: 'brokerageAmount', label: 'Brokerage Amount', render: (v) => formatMoney(v) },
    { key: 'additionalCharges', label: 'Additional Charges', render: (v) => formatMoney(v) },
    {
      key: 'totalAmount',
      label: 'Total (Net)',
      render: (v, t) => formatMoney(Number.isFinite(Number(v)) ? v : computeNetTotal(t))
    }
  ];

  const searchConfig = {
    enabled: true,
    placeholder: 'Search by broker, project, date...',
    searchFields: ['client', 'project', 'date']
  };

  const filters = [
    {
      key: 'client',
      label: 'Broker',
      type: 'searchable',
      placeholder: 'All Brokers',
      icon: <FiUser className="w-5 h-5 text-gray-400" />
    },
    {
      key: 'project',
      label: 'Project',
      type: 'searchable',
      placeholder: 'All Projects',
      icon: <FiFileText className="w-5 h-5 text-gray-400" />
    }
  ];

  return (
    <DataTable
      data={transactions}
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

export default TransactionTable;

