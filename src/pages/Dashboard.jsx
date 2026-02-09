import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../store/projects/projectsSlice';
import {
  createTransaction,
  editTransaction,
  fetchTransactions,
  removeTransaction
} from '../store/transactions/transactionsSlice';
import { fetchExpenses } from '../store/expenses/expensesSlice';
import { useAuth } from '../contexts/AuthContext';
import { getTargetAmount, setTargetAmount } from '../services/settingsService';
import { formatMoney } from '../utils/format';
import LineChartChartJS from '../components/LineChartChartJS';
import BarChart from '../components/BarChart';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import FilterBar from '../components/FilterBar';
import SearchableDropdown from '../components/SearchableDropdown';
import ModernDatePicker from '../components/ModernDatePicker';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import TransactionTable from '../components/TransactionTable';
import TransactionFormModal from '../components/TransactionFormModal';
import { FiDollarSign, FiTarget, FiEdit2 } from 'react-icons/fi';

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

/** Normalize any date value to YYYY-MM-DD for reliable comparison (handles Firestore Timestamp, Date, string) */
function normalizeDateToYYYYMMDD(value) {
  if (value == null || value === '') return '';
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    const d = value.toDate();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  const str = String(value).trim();
  if (str.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const Dashboard = () => {
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects.items);
  const transactions = useSelector((state) => state.transactions.items);
  const expenses = useSelector((state) => state.expenses.items);
  const isLoading = useSelector((state) => state.transactions.isLoading);
  const projectsError = useSelector((state) => state.projects.error);
  const transactionsError = useSelector((state) => state.transactions.error);
  const expensesError = useSelector((state) => state.expenses.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [initialValues, setInitialValues] = useState(defaultForm);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [targetAmount, setTargetAmountState] = useState(null);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetInputValue, setTargetInputValue] = useState('');
  const [isSavingTarget, setIsSavingTarget] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Overview | FinHub';
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    getTargetAmount(user.uid).then(setTargetAmountState);
  }, [user?.uid]);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTransactions());
    dispatch(fetchExpenses());
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
    const forBroker = selectedBroker
      ? list.filter(
          (p) => (p.client || '').trim().toLowerCase() === selectedBroker.trim().toLowerCase()
        )
      : list;
    return forBroker
      .filter((p) => p.id)
      .map((p) => ({
        value: p.id,
        label: selectedBroker ? (p.project || p.id) : [p.client, p.project].filter(Boolean).join(' – ') || p.id
      }));
  }, [projects, selectedBroker]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId || !projects?.length) return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId, projects]);

  const filteredTransactions = useMemo(() => {
    let list = transactions || [];
    if (selectedProject) {
      list = list.filter(
        (t) =>
          (t.client || '').trim().toLowerCase() === (selectedProject.client || '').trim().toLowerCase() &&
          (t.project || '').trim().toLowerCase() === (selectedProject.project || '').trim().toLowerCase()
      );
    } else if (selectedBroker) {
      list = list.filter(
        (t) => (t.client || '').trim().toLowerCase() === selectedBroker.trim().toLowerCase()
      );
    }
    if (dateFrom) {
      const from = normalizeDateToYYYYMMDD(dateFrom);
      list = list.filter((t) => {
        const tDate = normalizeDateToYYYYMMDD(t.date);
        return tDate && tDate >= from;
      });
    }
    if (dateTo) {
      const to = normalizeDateToYYYYMMDD(dateTo);
      list = list.filter((t) => {
        const tDate = normalizeDateToYYYYMMDD(t.date);
        return tDate && tDate <= to;
      });
    }
    return list;
  }, [transactions, selectedProject, selectedBroker, dateFrom, dateTo]);

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
      await dispatch(createTransaction(transactionData)).unwrap();
    }

    setIsModalOpen(false);
  };

  const onDelete = async (transactionId) => {
    await dispatch(removeTransaction(transactionId)).unwrap();
  };

  const openTargetModal = () => {
    setTargetInputValue(targetAmount != null ? String(targetAmount) : '');
    setIsTargetModalOpen(true);
  };

  const closeTargetModal = () => setIsTargetModalOpen(false);

  const onSaveTarget = async () => {
    if (!user?.uid) return;
    setIsSavingTarget(true);
    try {
      const value = await setTargetAmount(user.uid, targetInputValue);
      setTargetAmountState(value);
      closeTargetModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingTarget(false);
    }
  };

  const chartData = useMemo(() => {
    const toNumber = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let labels = [];
    let monthlyInward = [];
    let monthlyExpense = [];
    let monthsRange = [];

    if (dateFrom && dateTo) {
      const start = new Date(dateFrom);
      const end = new Date(dateTo);
      if (start > end) {
        labels = monthNames;
        monthlyInward = new Array(12).fill(0);
        monthlyExpense = new Array(12).fill(0);
      } else {
        const startYear = start.getFullYear();
        const startMonth = start.getMonth();
        const endYear = end.getFullYear();
        const endMonth = end.getMonth();
        const sameYear = startYear === endYear;
        monthsRange = [];
        for (let y = startYear; y <= endYear; y++) {
          const mStart = y === startYear ? startMonth : 0;
          const mEnd = y === endYear ? endMonth : 11;
          for (let m = mStart; m <= mEnd; m++) {
            monthsRange.push({ year: y, month: m });
            labels.push(sameYear ? monthNames[m] : `${monthNames[m]} ${String(y).slice(-2)}`);
          }
        }
        monthlyInward = new Array(monthsRange.length).fill(0);
        monthlyExpense = new Array(monthsRange.length).fill(0);

        filteredTransactions.forEach((transaction) => {
          const tDate = normalizeDateToYYYYMMDD(transaction.date);
          if (!tDate) return;
          const d = new Date(tDate);
          const idx = monthsRange.findIndex((r) => r.year === d.getFullYear() && r.month === d.getMonth());
          if (idx === -1) return;
          const amount = toNumber(transaction.amount);
          const brokerageAmount = toNumber(transaction.brokerageAmount);
          const additionalCharges = toNumber(transaction.additionalCharges);
          const totalAmount = transaction.totalAmount !== undefined && transaction.totalAmount !== null
            ? toNumber(transaction.totalAmount)
            : amount - brokerageAmount - additionalCharges;
          monthlyInward[idx] += totalAmount;
        });

        if (!selectedProject) {
          (expenses || []).forEach((expense) => {
            const eDate = normalizeDateToYYYYMMDD(expense.date);
            if (!eDate) return;
            const d = new Date(eDate);
            const idx = monthsRange.findIndex((r) => r.year === d.getFullYear() && r.month === d.getMonth());
            if (idx === -1) return;
            monthlyExpense[idx] += Number(expense.amount) || 0;
          });
        }
      }
    } else {
      const currentYear = new Date().getFullYear();
      labels = monthNames;
      monthlyInward = new Array(12).fill(0);
      monthlyExpense = new Array(12).fill(0);

      filteredTransactions.forEach((transaction) => {
        const tDate = normalizeDateToYYYYMMDD(transaction.date);
        if (!tDate) return;
        const date = new Date(tDate);
        if (date.getFullYear() === currentYear) {
          const month = date.getMonth();
          const amount = toNumber(transaction.amount);
          const brokerageAmount = toNumber(transaction.brokerageAmount);
          const additionalCharges = toNumber(transaction.additionalCharges);
          const totalAmount = transaction.totalAmount !== undefined && transaction.totalAmount !== null
            ? toNumber(transaction.totalAmount)
            : amount - brokerageAmount - additionalCharges;
          monthlyInward[month] += totalAmount;
        }
      });

      if (!selectedProject) {
        (expenses || []).forEach((expense) => {
          const eDate = normalizeDateToYYYYMMDD(expense.date);
          if (!eDate) return;
          const date = new Date(eDate);
          if (date.getFullYear() === currentYear) {
            const month = date.getMonth();
            monthlyExpense[month] += Number(expense.amount) || 0;
          }
        });
      }
    }

    return {
      labels,
      inward: monthlyInward,
      expense: monthlyExpense
    };
  }, [filteredTransactions, expenses, selectedProject, dateFrom, dateTo]);

  const { inwardPct, expensePct, totalInward, availableAmount } = useMemo(() => {
    const inward = (chartData.inward || []).reduce((s, v) => s + (Number(v) || 0), 0);
    const expense = (chartData.expense || []).reduce((s, v) => s + (Number(v) || 0), 0);
    const total = inward + expense;
    const pct = total === 0 ? { inwardPct: 0, expensePct: 0 } : {
      inwardPct: Math.round((inward / total) * 100),
      expensePct: Math.round((expense / total) * 100)
    };
    return {
      ...pct,
      totalInward: inward,
      totalExpense: expense,
      availableAmount: inward - expense
    };
  }, [chartData]);

  const lineChartData = useMemo(() => [
    {
      label: `Inward (${inwardPct}%)`,
      values: chartData.inward,
      color: '#10b981'
    },
    {
      label: `Expense (${expensePct}%)`,
      values: chartData.expense,
      color: '#ef4444'
    }
  ], [chartData, inwardPct, expensePct]);

  const barChartData = useMemo(() => [
    {
      label: `Inward (${inwardPct}%)`,
      values: chartData.inward,
      color: '#10b981'
    },
    {
      label: `Expense (${expensePct}%)`,
      values: chartData.expense,
      color: '#ef4444'
    }
  ], [chartData, inwardPct, expensePct]);

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="w-full space-y-8">
        <PageHeader title="Overview" actions={<Button onClick={openAddModal}>Add Transaction</Button>} />

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary-500">
            <div className="flex items-center gap-2">
              <span className="text-primary-500"><FiDollarSign className="w-5 h-5" /></span>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Available Amount</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-primary-600">{formatMoney(availableAmount)}</p>
            <p className="mt-1 text-xs text-gray-500">Total Inward − Total Expense (for selected period)</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary-500">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-primary-500"><FiTarget className="w-5 h-5" /></span>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Inward / Target</p>
              </div>
              <Button onClick={openTargetModal}>
                <FiEdit2 className="w-4 h-4" />
                {targetAmount != null ? 'Edit target' : 'Set target'}
              </Button>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {targetAmount != null && targetAmount > 0 ? (
                <>
                  <span className={totalInward >= targetAmount ? 'text-green-600' : 'text-red-600'}>
                    {formatMoney(totalInward)}
                  </span>
                  <span className="text-gray-500 font-normal"> / </span>
                  <span className="text-gray-700">{formatMoney(targetAmount)}</span>
                </>
              ) : (
                <>
                  <span className="text-primary-600">{formatMoney(totalInward)}</span>
                  <span className="block text-sm font-normal text-gray-500 mt-1">Set a target amount to track progress</span>
                </>
              )}
            </p>
          </div>
        </div>

        {(projectsError || transactionsError || expensesError) && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {projectsError && <p>{projectsError}</p>}
            {transactionsError && <p>{transactionsError}</p>}
            {expensesError && <p>{expensesError}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChartChartJS
            data={lineChartData}
            labels={chartData.labels}
            title="Monthly Trends"
          />
          <BarChart
            data={barChartData}
            labels={chartData.labels}
            title="Monthly Comparison"
          />
        </div>

        <TransactionTable
          transactions={filteredTransactions}
          onDelete={onDelete}
          onEdit={openEditModal}
          isLoading={isLoading}
          title={
            selectedProject
              ? `Transactions – ${[selectedProject.client, selectedProject.project].filter(Boolean).join(' – ')}`
              : selectedBroker
                ? `Transactions – ${selectedBroker}`
                : 'Recent Transactions'
          }
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

      <Modal isOpen={isTargetModalOpen} onClose={closeTargetModal} title="Set Target Amount">
        <div className="space-y-4">
          <InputField
            label="Target Amount"
            type="number"
            min="0"
            step="1"
            value={targetInputValue}
            onChange={(e) => setTargetInputValue(e.target.value)}
            placeholder="Enter target amount"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={closeTargetModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
              Cancel
            </Button>
            <Button onClick={onSaveTarget} disabled={isSavingTarget}>
              {isSavingTarget ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
