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
import LineChartChartJS from '../components/LineChartChartJS';
import BarChart from '../components/BarChart';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import TransactionTable from '../components/TransactionTable';
import TransactionFormModal from '../components/TransactionFormModal';

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

const Dashboard = () => {
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects.items);
  const transactions = useSelector((state) => state.transactions.items);
  const expenses = useSelector((state) => state.expenses.items);
  const isLoading = useSelector((state) => state.transactions.isLoading);
  const transactionsError = useSelector((state) => state.transactions.error);
  const expensesError = useSelector((state) => state.expenses.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [initialValues, setInitialValues] = useState(defaultForm);

  useEffect(() => {
    document.title = 'Overview | Finance Management';
  }, []);

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

  const chartData = useMemo(() => {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyInward = new Array(12).fill(0);
    const monthlyExpense = new Array(12).fill(0);

    (transactions || []).forEach((transaction) => {
      if (!transaction.date) return;
      const date = new Date(transaction.date);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const toNumber = (v) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : 0;
        };
        const amount = toNumber(transaction.amount);
        const brokerageAmount = toNumber(transaction.brokerageAmount);
        const additionalCharges = toNumber(transaction.additionalCharges);
        const totalAmount = transaction.totalAmount !== undefined && transaction.totalAmount !== null
          ? toNumber(transaction.totalAmount)
          : amount - brokerageAmount - additionalCharges;
        monthlyInward[month] += totalAmount;
      }
    });

    (expenses || []).forEach((expense) => {
      if (!expense.date) return;
      const date = new Date(expense.date);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const amount = Number(expense.amount) || 0;
        monthlyExpense[month] += amount;
      }
    });

    return {
      labels: monthLabels,
      inward: monthlyInward,
      expense: monthlyExpense
    };
  }, [transactions, expenses]);

  const lineChartData = useMemo(() => [
    {
      label: 'Inward',
      values: chartData.inward,
      color: '#10b981'
    },
    {
      label: 'Expense',
      values: chartData.expense,
      color: '#ef4444'
    }
  ], [chartData]);

  const barChartData = useMemo(() => [
    {
      label: 'Inward',
      values: chartData.inward,
      color: '#10b981'
    },
    {
      label: 'Expense',
      values: chartData.expense,
      color: '#ef4444'
    }
  ], [chartData]);

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="w-full space-y-8">
        <PageHeader
          title="Overview"
          actions={<Button onClick={openAddModal}>Add Transaction</Button>}
        />

        {(transactionsError || expensesError) && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
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
          transactions={transactions}
          onDelete={onDelete}
          onEdit={openEditModal}
          isLoading={isLoading}
          title="Recent Transactions"
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

export default Dashboard;
