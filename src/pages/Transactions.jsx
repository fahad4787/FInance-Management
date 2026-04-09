import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import DateFilterControls from '../components/DateFilterControls';
import FilterBar from '../components/FilterBar';
import SearchableDropdown from '../components/SearchableDropdown';
import BarChart from '../components/BarChart';
import LineChartChartJS from '../components/LineChartChartJS';
import TransactionTable from '../components/TransactionTable';
import TransactionFormModal from '../components/TransactionFormModal';
import MissingTransactionsFloating from '../components/MissingTransactionsFloating';
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
import { useClientOptions } from '../hooks/useClientOptions';
import ErrorAlert from '../components/ErrorAlert';
import PageContainer from '../components/PageContainer';
import { PAYOUT_OCCURRENCE_LABEL_BY_VALUE } from '../constants/payoutOccurrences';
import { isProjectEligibleForTransactions } from '../utils/transactionsEligibility';
import { countExpectedPayoutsInRange, countExpectedWithCarryover, getPayoutOccurrenceLabel } from '../utils/payoutSchedule';

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

  const dateFilter = useDateFilter({ defaultToPreviousMonth: true });
  const { effectiveDateFrom: dateFrom, effectiveDateTo: dateTo } = dateFilter;
  const [selectedBroker, setSelectedBroker] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [initialValues, setInitialValues] = useState(defaultForm);
  const [isMissingOpen, setIsMissingOpen] = useState(false);

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

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    const [client, project] = selectedProjectId.split('|');
    const matches = (projects || []).filter(
      (p) => (p.client || '').trim() === client && (p.project || '').trim() === project
    );
    if (matches.length === 0) return null;
    return matches.sort((a, b) => (b.createdAt || b.date || '').localeCompare(a.createdAt || a.date || ''))[0];
  }, [projects, selectedProjectId]);

  const monthBuckets = useMemo(() => {
    if (!dateFrom || !dateTo) return [];
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    if (!(start <= end)) return [];
    const months = [];
    const d = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    while (d <= endMonth) {
      months.push({ year: d.getFullYear(), month: d.getMonth() });
      d.setMonth(d.getMonth() + 1);
    }
    return months;
  }, [dateFrom, dateTo]);

  const missingTransactionsList = useMemo(() => {
    if (!dateFrom || !dateTo || monthBuckets.length === 0) return [];

    const approvedProjects = (projects || []).filter(isApproved);
    const latestByKey = new Map();
    approvedProjects.forEach((p) => {
      const client = (p.client || '').trim();
      const project = (p.project || '').trim();
      if (!client || !project) return;
      const key = `${client}|${project}`;
      const prev = latestByKey.get(key);
      if (!prev) {
        latestByKey.set(key, p);
        return;
      }
      const prevDate = prev.createdAt || prev.date || '';
      const nextDate = p.createdAt || p.date || '';
      if (String(nextDate).localeCompare(String(prevDate)) > 0) latestByKey.set(key, p);
    });

    const approvedTx = (transactions || []).filter(isApproved);
    const txByKey = new Map();
    const actualCountByKey = new Map();
    approvedTx.forEach((t) => {
      const client = (t.client || '').trim();
      const project = (t.project || '').trim();
      if (!client || !project) return;
      const ymd = normalizeDateToYYYYMMDD(t.date);
      if (!ymd) return;
      const td = new Date(ymd);
      const inRangeMonth = monthBuckets.some((m) => m.year === td.getFullYear() && m.month === td.getMonth());
      if (!inRangeMonth) return;
      const key = `${client}|${project}`;
      actualCountByKey.set(key, (actualCountByKey.get(key) || 0) + 1);
      const arr = txByKey.get(key) || [];
      arr.push(t);
      txByKey.set(key, arr);
    });

    const results = [];
    latestByKey.forEach((p, key) => {
      const txForProject = txByKey.get(key) || [];
      const expectedInRange = countExpectedPayoutsInRange(p, dateFrom, dateTo);
      const actualInRange = actualCountByKey.get(key) || 0;
      const carryMeta = countExpectedWithCarryover(p, txForProject, dateFrom, dateTo);
      const missing = Math.max(0, (expectedInRange + carryMeta.carryIn) - actualInRange);
      if (missing <= 0) return;
      const cadenceLabel = getPayoutOccurrenceLabel(p, PAYOUT_OCCURRENCE_LABEL_BY_VALUE);
      const [client, project] = key.split('|');
      results.push({
        key,
        client,
        project,
        missing,
        cadenceLabel
      });
    });

    results.sort((a, b) => b.missing - a.missing || a.client.localeCompare(b.client) || a.project.localeCompare(b.project));
    return results;
  }, [projects, transactions, dateFrom, dateTo, monthBuckets]);

  const missingTransactionsMessage = useMemo(() => {
    if (!dateFrom || !dateTo) return '';
    if (selectedProjectId) {
      const project = selectedProject;
      if (!project || monthBuckets.length === 0) return '';
      const [client, projectName] = selectedProjectId.split('|');
      const txForProject = (transactions || [])
        .filter(isApproved)
        .filter((t) => (t.client || '').trim() === client && (t.project || '').trim() === projectName)
      const expectedInRange = countExpectedPayoutsInRange(project, dateFrom, dateTo);
      const actualInRange = txForProject
        .filter((t) => {
          const ymd = normalizeDateToYYYYMMDD(t.date);
          if (!ymd) return false;
          const td = new Date(ymd);
          return monthBuckets.some((m) => m.year === td.getFullYear() && m.month === td.getMonth());
        }).length;
      const carryMeta = countExpectedWithCarryover(project, txForProject, dateFrom, dateTo);
      const missing = Math.max(0, (expectedInRange + carryMeta.carryIn) - actualInRange);
      if (missing <= 0) return '';
      const cadenceLabel = getPayoutOccurrenceLabel(project, PAYOUT_OCCURRENCE_LABEL_BY_VALUE);
      return `Missing ${missing} transaction${missing === 1 ? '' : 's'} (${cadenceLabel})`;
    }
    if (missingTransactionsList.length === 0) return '';
    return `Missing transactions in this range (${missingTransactionsList.length} project${missingTransactionsList.length === 1 ? '' : 's'})`;
  }, [dateFrom, dateTo, selectedProjectId, selectedProject, transactions, monthBuckets, missingTransactionsList]);

  const missingRangeLabel = useMemo(() => {
    if (!dateFrom || !dateTo) return '';
    const sameMonth = String(dateFrom).slice(0, 7) === String(dateTo).slice(0, 7);
    return sameMonth ? `Month: ${String(dateFrom).slice(0, 7)}` : `Range: ${dateFrom} → ${dateTo}`;
  }, [dateFrom, dateTo]);

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
      data: [{ label: 'Amount', values, color: '#10b981' }]
    };
  }, [approvedForCharts]);

  useEffect(() => {
    document.title = 'Transactions | FinHub';
  }, []);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const eligibleProjectsForTx = useMemo(
    () => (projects || []).filter((p) => isProjectEligibleForTransactions(p, 2)),
    [projects]
  );

  const clientOptions = useClientOptions(eligibleProjectsForTx);

  const projectOptions = useMemo(() => {
    const list = eligibleProjectsForTx;
    const filtered = selectedBroker ? list.filter((p) => (p.client || '').trim() === selectedBroker) : list;
    return filtered.map((p) => ({
      value: `${(p.client || '').trim()}|${(p.project || '').trim()}`,
      label: [p.client, p.project].filter(Boolean).join(' – ') || 'Unnamed'
    }));
  }, [eligibleProjectsForTx, selectedBroker]);

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
    <PageContainer>
      <PageHeader title="Transactions" actions={<Button onClick={openAddModal}>Add Transaction</Button>} />

        <FilterBar
          stats={null}
        >
          <SearchableDropdown
            label="Broker"
            value={selectedBroker}
            onChange={(v) => {
              setSelectedBroker(v);
              setSelectedProjectId('');
            }}
            options={clientOptions}
            placeholder="All Brokers"
            layout="md"
          />
          <SearchableDropdown
            label="Project"
            value={projectOptions.find((p) => p.value === selectedProjectId)?.label ?? ''}
            onChange={(label) => {
              if (!label) {
                setSelectedProjectId('');
                return;
              }
              const match = projectOptions.find((p) => p.label === label);
              if (match) setSelectedProjectId(match.value);
            }}
            options={projectOptions.map((p) => p.label)}
            placeholder={selectedBroker ? 'All Projects' : 'Select broker first'}
            layout="lg"
          />
          <DateFilterControls {...dateFilter} />
        </FilterBar>

        <ErrorAlert message={error} />

        {(monthlyTrendData.labels.length > 0 && monthlyTrendData.values.some((v) => v > 0)) || projectChartData.labels.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {monthlyTrendData.labels.length > 0 && monthlyTrendData.values.some((v) => v > 0) && (
              <LineChartChartJS
                data={[{ label: 'Transactions (Net)', values: monthlyTrendData.values, color: '#10b981' }]}
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
        ) : null}

        <TransactionTable
          transactions={approvedForTable}
          onDelete={onDelete}
          onEdit={openEditModal}
          isLoading={isLoading}
          title="Transaction Details"
          hideFilters={['client', 'project']}
        />

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
        transactions={transactions}
        editingTransactionId={editingTransactionId}
      />

      <MissingTransactionsFloating
        isOpen={isMissingOpen}
        onOpen={() => setIsMissingOpen(true)}
        onClose={() => setIsMissingOpen(false)}
        title="Missing transactions"
        summary={missingTransactionsMessage}
        rangeLabel={missingRangeLabel}
        items={selectedProjectId ? [] : missingTransactionsList}
        emptyText={dateFrom && dateTo ? 'No missing transactions in this range.' : 'Select a date range to check missing transactions.'}
      />
    </PageContainer>
  );
};

export default Transactions;

