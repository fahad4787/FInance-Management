import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ModernDatePicker from '../components/ModernDatePicker';
import FilterBar from '../components/FilterBar';
import SearchableDropdown from '../components/SearchableDropdown';
import BarChart from '../components/BarChart';
import LineChartChartJS from '../components/LineChartChartJS';
import TransactionTable from '../components/TransactionTable';
import TransactionFormModal from '../components/TransactionFormModal';
import { fetchProjects } from '../store/projects/projectsSlice';
import {
  createTransaction,
  editTransaction,
  fetchTransactions,
  removeTransaction
} from '../store/transactions/transactionsSlice';
import { normalizeDateToYYYYMMDD, filterByDateRange, MONTH_NAMES } from '../utils/date';
import { isApproved } from '../constants/app';
import { useDateFilter } from '../hooks/useDateFilter';

const defaultForm = {
  client: '',
  project: '',
  date: '',
  amount: '',
  brokerageType: 'percentage',
  brokerageValue: '',
  brokerageAmount: '',
  additionalCharges: ''
};

const Transactions = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const projects = useSelector((state) => state.projects.items);
  const transactions = useSelector((state) => state.transactions.items);
  const isLoading = useSelector((state) => state.transactions.isLoading);
  const error = useSelector((state) => state.transactions.error);

  const { dateFrom, setDateFrom, dateTo, setDateTo } = useDateFilter();
  const [selectedBroker, setSelectedBroker] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [initialValues, setInitialValues] = useState(defaultForm);

  const filteredTransactions = useMemo(() => {
    let list = filterByDateRange(transactions || [], dateFrom, dateTo, (t) => t.date);
    if (selectedBroker) list = list.filter((t) => (t.client || '').trim() === selectedBroker);
    if (selectedProjectId) {
      const [client, project] = selectedProjectId.split('|');
      list = list.filter((t) => (t.client || '').trim() === client && (t.project || '').trim() === project);
    }
    return list;
  }, [transactions, dateFrom, dateTo, selectedBroker, selectedProjectId]);

  const approvedForCharts = useMemo(
    () => (filteredTransactions || []).filter(isApproved),
    [filteredTransactions]
  );
  const approvedForTable = useMemo(
    () => (filteredTransactions || []).filter(isApproved),
    [filteredTransactions]
  );

  const monthlyTrendData = useMemo(() => {
    const list = approvedForCharts;
    let labels = [];
    let monthsRange = [];
    if (dateFrom && dateTo) {
      const start = new Date(dateFrom);
      const end = new Date(dateTo);
      if (start <= end) {
        const startYear = start.getFullYear();
        const startMonth = start.getMonth();
        const endYear = end.getFullYear();
        const endMonth = end.getMonth();
        const sameYear = startYear === endYear;
        for (let y = startYear; y <= endYear; y++) {
          const mStart = y === startYear ? startMonth : 0;
          const mEnd = y === endYear ? endMonth : 11;
          for (let m = mStart; m <= mEnd; m++) {
            labels.push(sameYear ? MONTH_NAMES[m] : `${MONTH_NAMES[m]} ${String(y).slice(-2)}`);
            monthsRange.push({ year: y, month: m });
          }
        }
        const monthlyTotals = new Array(monthsRange.length).fill(0);
        list.forEach((t) => {
          const tDate = normalizeDateToYYYYMMDD(t.date);
          if (!tDate) return;
          const d = new Date(tDate);
          const idx = monthsRange.findIndex((r) => r.year === d.getFullYear() && r.month === d.getMonth());
          if (idx === -1) return;
          const netBefore = Number.isFinite(Number(t.totalAmount)) ? Number(t.totalAmount) : (Number(t.amount) || 0) - (Number(t.brokerageAmount) || 0) - (Number(t.additionalCharges) || 0);
          monthlyTotals[idx] += netBefore * 0.98;
        });
        return { labels, values: monthlyTotals };
      }
    }
    return { labels: [], values: [] };
  }, [approvedForCharts, dateFrom, dateTo]);

  const projectChartData = useMemo(() => {
    const list = approvedForCharts;
    const byProject = {};
    list.forEach((t) => {
      const netBefore = Number.isFinite(Number(t.totalAmount)) ? Number(t.totalAmount) : (Number(t.amount) || 0) - (Number(t.brokerageAmount) || 0) - (Number(t.additionalCharges) || 0);
      const netAfterImpactFund = netBefore * 0.98;
      const label = [t.client, t.project].filter(Boolean).join(' – ') || 'Other';
      byProject[label] = (byProject[label] || 0) + netAfterImpactFund;
    });
    const labels = Object.keys(byProject).sort();
    const values = labels.map((k) => byProject[k]);
    return {
      labels,
      data: [{ label: 'Amount', values, color: '#0ea5e9' }]
    };
  }, [approvedForCharts]);

  useEffect(() => {
    document.title = 'Transactions | FinHub';
  }, []);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const clientOptions = useMemo(() => {
    const clients = (projects || [])
      .map((p) => p.client)
      .filter(Boolean)
      .map((c) => String(c).trim())
      .filter(Boolean);
    return [...new Set(clients)].sort();
  }, [projects]);

  const projectOptions = useMemo(() => {
    const list = projects || [];
    const filtered = selectedBroker ? list.filter((p) => (p.client || '').trim() === selectedBroker) : list;
    return filtered.map((p) => ({
      value: `${(p.client || '').trim()}|${(p.project || '').trim()}`,
      label: [p.client, p.project].filter(Boolean).join(' – ') || 'Unnamed'
    }));
  }, [projects, selectedBroker]);

  const openAddModal = () => {
    setEditingTransactionId(null);
    setInitialValues(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction, transactionId) => {
    setEditingTransactionId(transactionId);
    setInitialValues({
      ...defaultForm,
      client: transaction.client || '',
      project: transaction.project || '',
      date: transaction.date || '',
      amount: transaction.amount ?? '',
      brokerageType: transaction.brokerageType || 'percentage',
      brokerageValue: transaction.brokerageValue ?? '',
      brokerageAmount: transaction.brokerageAmount ?? '',
      additionalCharges: transaction.additionalCharges ?? ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onSubmit = async (transactionData) => {
    if (editingTransactionId) {
      await dispatch(
        editTransaction({ transactionId: editingTransactionId, transactionData })
      ).unwrap();
      setEditingTransactionId(null);
    } else {
      const payload = user?.uid ? { ...transactionData, createdBy: user.uid } : transactionData;
      await dispatch(createTransaction(payload)).unwrap();
    }

    setIsModalOpen(false);
  };

  const onDelete = async (transactionId) => {
    await dispatch(removeTransaction(transactionId)).unwrap();
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="w-full space-y-8">
        <PageHeader
          title="Transactions"
          actions={<Button onClick={openAddModal}>Add Transaction</Button>}
        />

        <FilterBar>
          <SearchableDropdown
            label="Broker"
            value={selectedBroker}
            onChange={(v) => {
              setSelectedBroker(v);
              setSelectedProjectId('');
            }}
            options={clientOptions}
            placeholder="All Brokers"
            className="min-w-[160px] sm:min-w-[200px]"
          />
          <SearchableDropdown
            label="Project"
            value={projectOptions.find((p) => p.value === selectedProjectId)?.label ?? ''}
            onChange={(label) => setSelectedProjectId(projectOptions.find((p) => p.label === label)?.value ?? '')}
            options={projectOptions.map((p) => p.label)}
            placeholder={selectedBroker ? 'All Projects' : 'Select broker first'}
            className="min-w-[160px] sm:min-w-[220px]"
          />
          <ModernDatePicker label="Start date" value={dateFrom} onChange={setDateFrom} placeholder="Start" className="min-w-[140px]" />
          <ModernDatePicker label="End date" value={dateTo} onChange={setDateTo} placeholder="End" className="min-w-[140px]" />
        </FilterBar>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {monthlyTrendData.labels.length > 0 && (
            <LineChartChartJS
              data={[{ label: 'Transactions (Net)', values: monthlyTrendData.values, color: '#0ea5e9' }]}
              labels={monthlyTrendData.labels}
              title="Monthly Trend"
            />
          )}
          {projectChartData.labels.length > 0 && (
            <BarChart
              data={projectChartData.data}
              labels={projectChartData.labels}
              title="Transactions by Project"
            />
          )}
        </div>

        <TransactionTable
          transactions={approvedForTable}
          onDelete={onDelete}
          onEdit={openEditModal}
          isLoading={isLoading}
          title="Transaction Details"
          hideFilters={['client', 'project']}
        />
      </div>

      <TransactionFormModal
        key={editingTransactionId || 'new'}
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTransactionId ? 'Edit Transaction' : 'Add Transaction'}
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSaving={isLoading}
        projects={projects}
        clientOptions={clientOptions}
      />
    </div>
  );
};

export default Transactions;

