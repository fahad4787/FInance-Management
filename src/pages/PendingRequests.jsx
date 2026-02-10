import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import DataTable from '../components/DataTable';
import { formatMoney } from '../utils/format';
import { isApproved, ENTRY_STATUS } from '../constants/app';
import { fetchTransactions, approveTransaction } from '../store/transactions/transactionsSlice';
import { fetchExpenses, approveExpense } from '../store/expenses/expensesSlice';
import { fetchProjects, approveProject } from '../store/projects/projectsSlice';
import { EXPENSE_TYPE_LABELS } from '../constants/expenseTypes';

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const computeNetAfterImpactFund = (t) => {
  const netBefore = Number.isFinite(Number(t.totalAmount)) ? Number(t.totalAmount) : (toNumber(t.amount) - toNumber(t.brokerageAmount) - toNumber(t.additionalCharges));
  return netBefore * 0.98;
};

const PendingRequests = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const transactions = useSelector((state) => state.transactions.items);
  const expenses = useSelector((state) => state.expenses.items);
  const projects = useSelector((state) => state.projects.items);
  const isLoadingT = useSelector((state) => state.transactions.isLoading);
  const isLoadingE = useSelector((state) => state.expenses.isLoading);
  const isLoadingP = useSelector((state) => state.projects.isLoading);
  const errorT = useSelector((state) => state.transactions.error);
  const errorE = useSelector((state) => state.expenses.error);
  const errorP = useSelector((state) => state.projects.error);

  const pendingTransactions = useMemo(
    () => (transactions || []).filter((t) => !isApproved(t)),
    [transactions]
  );
  const pendingExpenses = useMemo(
    () => (expenses || []).filter((e) => !isApproved(e)),
    [expenses]
  );
  const pendingProjects = useMemo(
    () => (projects || []).filter((p) => !isApproved(p)),
    [projects]
  );

  const currentUserId = user?.uid ?? null;

  useEffect(() => {
    document.title = 'Pending Requests | FinHub';
  }, []);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchExpenses());
    dispatch(fetchProjects());
  }, [dispatch]);

  const canApproveTransaction = (t) =>
    t?.status === ENTRY_STATUS.PENDING && t?.createdBy && currentUserId && t.createdBy !== currentUserId;
  const canApproveExpense = (e) =>
    e?.status === ENTRY_STATUS.PENDING && e?.createdBy && currentUserId && e.createdBy !== currentUserId;
  const canApproveProject = (p) =>
    p?.status === ENTRY_STATUS.PENDING && p?.createdBy && currentUserId && p.createdBy !== currentUserId;

  const onApproveTransaction = async (id) => {
    if (!currentUserId) return;
    await dispatch(approveTransaction({ transactionId: id, approvedBy: currentUserId })).unwrap();
  };
  const onApproveExpense = async (id) => {
    if (!currentUserId) return;
    await dispatch(approveExpense({ expenseId: id, approvedBy: currentUserId })).unwrap();
  };
  const onApproveProject = async (id) => {
    if (!currentUserId) return;
    await dispatch(approveProject({ projectId: id, approvedBy: currentUserId })).unwrap();
  };

  const [approvingAll, setApprovingAll] = useState({ t: false, e: false, p: false });

  const approvableTransactionIds = pendingTransactions.filter(canApproveTransaction).map((t) => t.id);
  const approvableExpenseIds = pendingExpenses.filter(canApproveExpense).map((e) => e.id);
  const approvableProjectIds = pendingProjects.filter(canApproveProject).map((p) => p.id);

  const onApproveAllTransactions = async () => {
    if (!currentUserId || approvableTransactionIds.length === 0) return;
    setApprovingAll((prev) => ({ ...prev, t: true }));
    try {
      for (const id of approvableTransactionIds) {
        await dispatch(approveTransaction({ transactionId: id, approvedBy: currentUserId })).unwrap();
      }
    } finally {
      setApprovingAll((prev) => ({ ...prev, t: false }));
    }
  };
  const onApproveAllExpenses = async () => {
    if (!currentUserId || approvableExpenseIds.length === 0) return;
    setApprovingAll((prev) => ({ ...prev, e: true }));
    try {
      for (const id of approvableExpenseIds) {
        await dispatch(approveExpense({ expenseId: id, approvedBy: currentUserId })).unwrap();
      }
    } finally {
      setApprovingAll((prev) => ({ ...prev, e: false }));
    }
  };
  const onApproveAllProjects = async () => {
    if (!currentUserId || approvableProjectIds.length === 0) return;
    setApprovingAll((prev) => ({ ...prev, p: true }));
    try {
      for (const id of approvableProjectIds) {
        await dispatch(approveProject({ projectId: id, approvedBy: currentUserId })).unwrap();
      }
    } finally {
      setApprovingAll((prev) => ({ ...prev, p: false }));
    }
  };

  const approveButton = (item, canApprove, onApprove) =>
    canApprove(item) ? (
      <button
        type="button"
        onClick={() => onApprove(item.id)}
        className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Approve
      </button>
    ) : null;

  const actionColumn = (key, canApprove, onApprove) => ({
    key,
    label: 'Action',
    render: (_, item) => approveButton(item, canApprove, onApprove)
  });

  const transactionColumns = [
    { key: 'client', label: 'Broker' },
    { key: 'project', label: 'Project' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (v) => formatMoney(v) },
    {
      key: 'totalAmount',
      label: 'Total (Net)',
      render: (_, t) => formatMoney(computeNetAfterImpactFund(t))
    },
    ...(approvableTransactionIds.length > 0 ? [actionColumn('_approve', canApproveTransaction, onApproveTransaction)] : [])
  ];

  const expenseColumns = [
    { key: 'expenseName', label: 'Expense Name' },
    { key: 'date', label: 'Date' },
    {
      key: 'expenseType',
      label: 'Type',
      render: (v) => (v ? (EXPENSE_TYPE_LABELS[v?.toLowerCase()] || v) : '-')
    },
    { key: 'amount', label: 'Amount', render: (v) => formatMoney(v) },
    ...(approvableExpenseIds.length > 0 ? [actionColumn('_approve', canApproveExpense, onApproveExpense)] : [])
  ];

  const projectColumns = [
    { key: 'client', label: 'Broker' },
    { key: 'project', label: 'Project Name' },
    { key: 'date', label: 'Date' },
    { key: 'projectType', label: 'Type' },
    ...(approvableProjectIds.length > 0 ? [actionColumn('_approve', canApproveProject, onApproveProject)] : [])
  ];

  const anyError = errorT || errorE || errorP;

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="w-full space-y-8">
        <PageHeader title="Pending Requests" />

        {anyError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {[errorT, errorE, errorP].filter(Boolean).join(' ')}
          </div>
        )}

        <DataTable
          data={pendingTransactions}
          columns={transactionColumns}
          title="Pending Transactions"
          isLoading={isLoadingT}
          searchConfig={{ enabled: true, placeholder: 'Search by broker, project, date...', searchFields: ['client', 'project', 'date'] }}
          filters={[]}
          pagination={{ enabled: true, itemsPerPage: 10 }}
          emptyTitle="No pending transactions"
          emptyDescription="Transactions added by the other user will appear here for approval"
          titleActions={
            approvableTransactionIds.length > 0 ? (
              <Button
                onClick={onApproveAllTransactions}
                disabled={approvingAll.t}
                size="sm"
              >
                {approvingAll.t ? 'Approving…' : `Approve all (${approvableTransactionIds.length})`}
              </Button>
            ) : null
          }
        />

        <DataTable
          data={pendingExpenses}
          columns={expenseColumns}
          title="Pending Expenses"
          isLoading={isLoadingE}
          searchConfig={{ enabled: true, placeholder: 'Search by name, type, date...', searchFields: ['expenseName', 'expenseType', 'date'] }}
          filters={[]}
          pagination={{ enabled: true, itemsPerPage: 10 }}
          emptyTitle="No pending expenses"
          emptyDescription="Expenses added by the other user will appear here for approval"
          titleActions={
            approvableExpenseIds.length > 0 ? (
              <Button
                onClick={onApproveAllExpenses}
                disabled={approvingAll.e}
                size="sm"
              >
                {approvingAll.e ? 'Approving…' : `Approve all (${approvableExpenseIds.length})`}
              </Button>
            ) : null
          }
        />

        <DataTable
          data={pendingProjects}
          columns={projectColumns}
          title="Pending Projects"
          isLoading={isLoadingP}
          searchConfig={{ enabled: true, placeholder: 'Search by broker, project, date...', searchFields: ['client', 'project', 'date'] }}
          filters={[]}
          pagination={{ enabled: true, itemsPerPage: 10 }}
          emptyTitle="No pending projects"
          emptyDescription="Projects added by the other user will appear here for approval"
          titleActions={
            approvableProjectIds.length > 0 ? (
              <Button
                onClick={onApproveAllProjects}
                disabled={approvingAll.p}
                size="sm"
              >
                {approvingAll.p ? 'Approving…' : `Approve all (${approvableProjectIds.length})`}
              </Button>
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default PendingRequests;
