import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import DataTable from '../components/DataTable';
import TransactionFormModal from '../components/TransactionFormModal';
import ExpenseFormModal from '../components/ExpenseFormModal';
import ProjectFormModal from '../components/ProjectFormModal';
import { formatMoney } from '../utils/format';
import { isApproved, ENTRY_STATUS } from '../constants/app';
import { fetchTransactions, approveTransaction, editTransaction } from '../store/transactions/transactionsSlice';
import { fetchExpenses, approveExpense, editExpense } from '../store/expenses/expensesSlice';
import { fetchProjects, approveProject, editProject } from '../store/projects/projectsSlice';
import { useClientOptions } from '../hooks/useClientOptions';
import { EXPENSE_TYPE_LABELS, EXPENSE_TYPE_COLORS, RECURRING_MONTHS_LABELS } from '../constants/expenseTypes';
import { PROJECT_TYPE_OPTIONS, PROJECT_TYPE_COLORS } from '../constants/projectTypes';
import ErrorAlert from '../components/ErrorAlert';
import PageContainer from '../components/PageContainer';
import Tabs from '../components/Tabs';

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const computeNetAfterImpactFund = (t) => {
  const netBefore = Number.isFinite(Number(t.totalAmount)) ? Number(t.totalAmount) : (toNumber(t.amount) - toNumber(t.brokerageAmount) - toNumber(t.additionalCharges));
  return netBefore * 0.98;
};

const defaultTransactionForm = {
  client: '',
  project: '',
  date: '',
  amount: '',
  brokerageType: 'percentage',
  brokerageValue: '',
  brokerageAmount: '',
  additionalCharges: ''
};

const defaultExpenseForm = {
  expenseName: '',
  date: '',
  expenseType: '',
  amount: '',
  comment: '',
  recurring: false,
  recurringMonths: ''
};

const defaultProjectForm = {
  client: '',
  date: '',
  project: '',
  projectType: '',
  projectStatus: 'active',
  totalMonthlyHours: '',
  hourlyRate: '',
  recruiterName: '',
  contractEnding: '',
  brokerageType: 'percentage',
  brokerageValue: ''
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

  const clientOptions = useClientOptions(projects);

  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [initialValuesTransaction, setInitialValuesTransaction] = useState(defaultTransactionForm);
  const [initialValuesExpense, setInitialValuesExpense] = useState(defaultExpenseForm);
  const [initialValuesProject, setInitialValuesProject] = useState(defaultProjectForm);

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
  const [activeTab, setActiveTab] = useState('transactions');

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

  const openEditTransaction = (transaction) => {
    setInitialValuesTransaction({
      ...defaultTransactionForm,
      client: transaction.client || '',
      project: transaction.project || '',
      date: transaction.date || '',
      amount: transaction.amount ?? '',
      brokerageType: transaction.brokerageType || 'percentage',
      brokerageValue: transaction.brokerageValue ?? '',
      brokerageAmount: transaction.brokerageAmount ?? '',
      additionalCharges: transaction.additionalCharges ?? ''
    });
    setEditingTransactionId(transaction.id);
  };

  const openEditExpense = (expense) => {
    const expenseTypeLabel = EXPENSE_TYPE_LABELS[expense.expenseType?.toLowerCase()] || expense.expenseType || '';
    setInitialValuesExpense({
      ...defaultExpenseForm,
      expenseName: expense.expenseName || '',
      date: expense.date || '',
      expenseType: expenseTypeLabel,
      amount: expense.amount ?? '',
      comment: expense.comment || '',
      recurring: !!expense.recurring,
      recurringMonths: RECURRING_MONTHS_LABELS[expense.recurringMonths] ?? expense.recurringMonths ?? ''
    });
    setEditingExpenseId(expense.id);
  };

  const openEditProject = (project) => {
    setInitialValuesProject({
      ...defaultProjectForm,
      client: project.client || '',
      date: project.date || '',
      project: project.project || '',
      projectType: project.projectType || '',
      projectStatus: project.projectStatus || 'active',
      totalMonthlyHours: project.totalMonthlyHours || '',
      hourlyRate: project.hourlyRate || '',
      recruiterName: project.recruiterName || '',
      contractEnding: project.contractEnding || '',
      brokerageType: project.brokerageType || 'percentage',
      brokerageValue: project.brokerageValue || ''
    });
    setEditingProjectId(project.id);
  };

  const closeEditTransaction = () => setEditingTransactionId(null);
  const closeEditExpense = () => setEditingExpenseId(null);
  const closeEditProject = () => setEditingProjectId(null);

  const submitEditTransaction = async (transactionData) => {
    if (!editingTransactionId) return;
    await dispatch(editTransaction({ transactionId: editingTransactionId, transactionData })).unwrap();
    setEditingTransactionId(null);
  };

  const submitEditExpense = async (expenseData) => {
    if (!editingExpenseId) return;
    await dispatch(editExpense({ expenseId: editingExpenseId, expenseData })).unwrap();
    setEditingExpenseId(null);
  };

  const submitEditProject = async (projectData) => {
    if (!editingProjectId) return;
    await dispatch(editProject({ projectId: editingProjectId, projectData: { ...projectData } })).unwrap();
    setEditingProjectId(null);
  };

  const transactionColumns = [
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
      render: (_, t) => formatMoney(computeNetAfterImpactFund(t))
    }
  ];

  const expenseColumns = [
    { key: 'expenseName', label: 'Expense Name' },
    { key: 'date', label: 'Date' },
    {
      key: 'expenseType',
      label: 'Type',
      render: (value, row) => {
        if (!value) return '-';
        const key = value?.toLowerCase();
        let label = EXPENSE_TYPE_LABELS[key] || value;
        if (key === 'software_tool' && row.recurring && row.recurringMonths) {
          const period = RECURRING_MONTHS_LABELS[row.recurringMonths] ?? `${row.recurringMonths} months`;
          label = `Software Tool (${period})`;
        }
        const colorClass = EXPENSE_TYPE_COLORS[key] || 'bg-gray-100 text-gray-800';
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

  const projectColumns = [
    { key: 'client', label: 'Broker' },
    { key: 'date', label: 'Date' },
    { key: 'project', label: 'Project Name' },
    {
      key: 'projectType',
      label: 'Project Type',
      render: (value) => {
        if (!value) return '-';
        const colorClass = PROJECT_TYPE_COLORS[value] || 'bg-gray-100 text-gray-800';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'projectStatus',
      label: 'Status',
      render: (value) => {
        const status = value || 'active';
        const isActive = status === 'active';
        const colorClass = isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    { key: 'totalMonthlyHours', label: 'Monthly Hours' },
    { key: 'hourlyRate', label: 'Hourly Rate' },
    { key: 'recruiterName', label: 'Recruiter Name' },
    { key: 'contractEnding', label: 'End Date' },
    {
      key: 'brokerage',
      label: 'Brokerage',
      render: (_, project) => {
        if (!project.brokerageValue) return '-';
        return project.brokerageType === 'percentage'
          ? `${project.brokerageValue}%`
          : `$${project.brokerageValue}`;
      }
    }
  ];

  const pendingTabs = [
    { id: 'transactions', label: 'Transactions', badge: pendingTransactions.length },
    { id: 'expenses', label: 'Expenses', badge: pendingExpenses.length },
    { id: 'projects', label: 'Projects', badge: pendingProjects.length }
  ];

  return (
    <PageContainer>
      <PageHeader title="Pending Requests" />

      <ErrorAlert messages={[errorT, errorE, errorP].filter(Boolean)} />

      <div className="space-y-0">
        <Tabs tabs={pendingTabs} activeId={activeTab} onChange={setActiveTab}>
          {activeTab === 'transactions' && (
            <DataTable
              data={pendingTransactions}
              columns={transactionColumns}
              title="Pending Transactions"
              isLoading={isLoadingT}
              onEdit={(item) => openEditTransaction(item)}
              onApprove={(id) => onApproveTransaction(id)}
              getCanApprove={canApproveTransaction}
              searchConfig={{ enabled: true, placeholder: 'Search by broker, project, date...', searchFields: ['client', 'project', 'date'] }}
              filters={[]}
              emptyTitle="No pending transactions"
              emptyDescription="Transactions added by the other user will appear here for approval"
              titleActions={
                approvableTransactionIds.length > 0 ? (
                  <Button onClick={onApproveAllTransactions} disabled={approvingAll.t} size="sm">
                    {approvingAll.t ? 'Approving…' : `Approve all (${approvableTransactionIds.length})`}
                  </Button>
                ) : null
              }
            />
          )}
          {activeTab === 'expenses' && (
            <DataTable
              data={pendingExpenses}
              columns={expenseColumns}
              title="Pending Expenses"
              isLoading={isLoadingE}
              onEdit={(item) => openEditExpense(item)}
              onApprove={(id) => onApproveExpense(id)}
              getCanApprove={canApproveExpense}
              searchConfig={{ enabled: true, placeholder: 'Search by name, type, date...', searchFields: ['expenseName', 'expenseType', 'date'] }}
              filters={[]}
              emptyTitle="No pending expenses"
              emptyDescription="Expenses added by the other user will appear here for approval"
              titleActions={
                approvableExpenseIds.length > 0 ? (
                  <Button onClick={onApproveAllExpenses} disabled={approvingAll.e} size="sm">
                    {approvingAll.e ? 'Approving…' : `Approve all (${approvableExpenseIds.length})`}
                  </Button>
                ) : null
              }
            />
          )}
          {activeTab === 'projects' && (
            <DataTable
              data={pendingProjects}
              columns={projectColumns}
              title="Pending Projects"
              isLoading={isLoadingP}
              onEdit={(item) => openEditProject(item)}
              onApprove={(id) => onApproveProject(id)}
              getCanApprove={canApproveProject}
              searchConfig={{ enabled: true, placeholder: 'Search by broker, project, date...', searchFields: ['client', 'project', 'date'] }}
              filters={[]}
              emptyTitle="No pending projects"
              emptyDescription="Projects added by the other user will appear here for approval"
              titleActions={
                approvableProjectIds.length > 0 ? (
                  <Button onClick={onApproveAllProjects} disabled={approvingAll.p} size="sm">
                    {approvingAll.p ? 'Approving…' : `Approve all (${approvableProjectIds.length})`}
                  </Button>
                ) : null
              }
            />
          )}
        </Tabs>
      </div>

      <TransactionFormModal
        key={editingTransactionId || 'new'}
        isOpen={!!editingTransactionId}
        onClose={closeEditTransaction}
        title="Edit Transaction"
        initialValues={initialValuesTransaction}
        onSubmit={submitEditTransaction}
        isSaving={isLoadingT}
        projects={projects}
        clientOptions={clientOptions}
      />

      <ExpenseFormModal
        key={editingExpenseId || 'new'}
        isOpen={!!editingExpenseId}
        onClose={closeEditExpense}
        title="Edit Expense"
        initialValues={initialValuesExpense}
        onSubmit={submitEditExpense}
        isSaving={isLoadingE}
      />

      <ProjectFormModal
        key={editingProjectId || 'new'}
        isOpen={!!editingProjectId}
        onClose={closeEditProject}
        title="Edit Project"
        clientOptions={clientOptions}
        projectTypeOptions={PROJECT_TYPE_OPTIONS}
        initialValues={initialValuesProject}
        onSubmit={submitEditProject}
        isSaving={isLoadingP}
        projects={projects}
      />
    </PageContainer>
  );
};

export default PendingRequests;
