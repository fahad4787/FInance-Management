import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatMoney } from '../utils/format';
import { fetchTransactions } from '../store/transactions/transactionsSlice';
import { fetchWithdrawals, createWithdrawal, updateWithdrawal, removeWithdrawal } from '../store/impactFund/impactFundSlice';
import { FiTrendingDown, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import Tabs from '../components/Tabs';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import TextareaField from '../components/TextareaField';
import ModernDatePicker from '../components/ModernDatePicker';
import FilterBar from '../components/FilterBar';
import SearchableDropdown from '../components/SearchableDropdown';
import { getThisMonthRange } from '../utils/date';

const IMPACT_FUND_PERCENT = 0.02;

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Normalize date to YYYY-MM-DD for comparison (handles Firestore Timestamp, Date, string) */
const normalizeDateToYYYYMMDD = (value) => {
  if (value == null || value === '') return '';
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    const d = value.toDate();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }
  const str = String(value).trim();
  if (str.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getTransactionNetAmount = (t) => {
  const total = t.totalAmount !== undefined && t.totalAmount !== null
    ? toNumber(t.totalAmount)
    : toNumber(t.amount) - toNumber(t.brokerageAmount) - toNumber(t.additionalCharges);
  return total;
};

const ImpactFund = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.items);
  const withdrawals = useSelector((state) => state.impactFund.withdrawals);
  const isLoading = useSelector((state) => state.impactFund.isLoading);
  const error = useSelector((state) => state.impactFund.error);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [editingWithdrawalId, setEditingWithdrawalId] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');
  const { from: defaultFrom, to: defaultTo } = getThisMonthRange();
  const [activeTab, setActiveTab] = useState('contrib');
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  useEffect(() => {
    document.title = 'Impact Fund | FinHub';
  }, []);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchWithdrawals());
  }, [dispatch]);

  const contributionHistory = useMemo(() => {
    return (transactions || [])
      .map((t) => {
        const net = getTransactionNetAmount(t);
        const amount = net * IMPACT_FUND_PERCENT;
        return {
          id: t.id,
          client: t.client || '',
          project: t.project || '',
          date: t.date || '',
          amount
        };
      })
      .filter((c) => c.amount > 0);
  }, [transactions]);

  const withdrawalRows = useMemo(() => {
    return (withdrawals || []).map((w) => ({
      ...w,
      dateDisplay: w.createdAt ? new Date(w.createdAt).toLocaleDateString() : '-'
    }));
  }, [withdrawals]);

  const brokerNames = useMemo(() =>
    [...new Set((contributionHistory || []).map((c) => c.client).filter(Boolean))].sort(),
  [contributionHistory]);

  const filteredContributionHistory = useMemo(() => {
    let list = contributionHistory;
    if (selectedBroker) {
      list = list.filter(
        (item) => (item.client || '').trim().toLowerCase() === selectedBroker.trim().toLowerCase()
      );
    }
    if (dateFrom) {
      const from = normalizeDateToYYYYMMDD(dateFrom);
      list = list.filter((item) => {
        const d = normalizeDateToYYYYMMDD(item.date);
        return d && d >= from;
      });
    }
    if (dateTo) {
      const to = normalizeDateToYYYYMMDD(dateTo);
      list = list.filter((item) => {
        const d = normalizeDateToYYYYMMDD(item.date);
        return d && d <= to;
      });
    }
    return list;
  }, [contributionHistory, selectedBroker, dateFrom, dateTo]);

  const totalFromSelectedBroker = useMemo(() => {
    if (!selectedBroker) return null;
    return filteredContributionHistory.reduce((sum, c) => sum + c.amount, 0);
  }, [selectedBroker, filteredContributionHistory]);

  const filteredWithdrawalRows = useMemo(() => {
    let list = withdrawalRows;
    if (dateFrom) {
      const from = normalizeDateToYYYYMMDD(dateFrom);
      list = list.filter((item) => {
        const d = normalizeDateToYYYYMMDD(item.createdAt);
        return d && d >= from;
      });
    }
    if (dateTo) {
      const to = normalizeDateToYYYYMMDD(dateTo);
      list = list.filter((item) => {
        const d = normalizeDateToYYYYMMDD(item.createdAt);
        return d && d <= to;
      });
    }
    return list;
  }, [withdrawalRows, dateFrom, dateTo]);

  const totalContributions = contributionHistory.reduce((sum, c) => sum + c.amount, 0);
  const totalWithdrawn = (withdrawals || []).reduce((sum, w) => sum + toNumber(w.amount), 0);
  const remaining = totalContributions - totalWithdrawn;

  const maxWithdrawable = useMemo(() => {
    if (editingWithdrawalId) {
      const current = withdrawals?.find((w) => w.id === editingWithdrawalId);
      return remaining + (current ? toNumber(current.amount) : 0);
    }
    return remaining;
  }, [remaining, editingWithdrawalId, withdrawals]);

  const statCards = [
    {
      label: 'Total Amount',
      value: formatMoney(totalContributions),
      Icon: FiDollarSign,
      valueClassName: 'text-primary-600',
      iconClassName: 'text-primary-500',
      borderClassName: 'border-primary-500'
    },
    {
      label: 'Withdrawn',
      value: formatMoney(totalWithdrawn),
      Icon: FiTrendingDown,
      valueClassName: 'text-red-600',
      iconClassName: 'text-red-500',
      borderClassName: 'border-red-500'
    },
    {
      label: 'Remaining',
      value: formatMoney(remaining),
      Icon: FiCreditCard,
      valueClassName: 'text-emerald-600',
      iconClassName: 'text-emerald-500',
      borderClassName: 'border-emerald-500'
    }
  ];

  const contributionColumns = [
    { key: 'client', label: 'Broker', align: 'text-left' },
    { key: 'project', label: 'Project Name', align: 'text-left' },
    { key: 'date', label: 'Date', align: 'text-left' },
    {
      key: 'amount',
      label: 'Amount (2%)',
      align: 'text-right',
      render: (v) => formatMoney(v)
    }
  ];

  const withdrawalColumns = [
    { key: 'dateDisplay', label: 'Date', align: 'text-left' },
    {
      key: 'amount',
      label: 'Amount',
      align: 'text-right',
      render: (v) => formatMoney(v)
    },
    { key: 'description', label: 'Description / Note', align: 'text-left', className: 'min-w-[280px] max-w-md' }
  ];

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawError('');
    const amount = toNumber(withdrawAmount);
    if (amount <= 0) {
      setWithdrawError('Amount must be greater than 0.');
      return;
    }
    if (amount > maxWithdrawable) {
      setWithdrawError(`Amount cannot exceed available balance (${formatMoney(maxWithdrawable)}).`);
      return;
    }
    if (editingWithdrawalId) {
      await dispatch(updateWithdrawal({
        id: editingWithdrawalId,
        amount,
        description: withdrawNote.trim() || undefined
      })).unwrap();
    } else {
      await dispatch(createWithdrawal({ amount, description: withdrawNote.trim() || undefined })).unwrap();
    }
    setWithdrawAmount('');
    setWithdrawNote('');
    setWithdrawError('');
    setEditingWithdrawalId(null);
    setIsWithdrawModalOpen(false);
  };

  const openWithdrawModal = () => {
    setEditingWithdrawalId(null);
    setWithdrawAmount('');
    setWithdrawNote('');
    setWithdrawError('');
    setIsWithdrawModalOpen(true);
  };

  const openEditWithdrawal = (withdrawal) => {
    setEditingWithdrawalId(withdrawal.id);
    setWithdrawAmount(withdrawal.amount != null ? String(withdrawal.amount) : '');
    setWithdrawNote(withdrawal.description || '');
    setWithdrawError('');
    setIsWithdrawModalOpen(true);
  };

  const handleDeleteWithdrawal = async (id) => {
    await dispatch(removeWithdrawal(id)).unwrap();
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="w-full space-y-8">
        <PageHeader title="Impact Fund" actions={<Button variant="danger" onClick={openWithdrawModal} disabled={remaining <= 0}><FiTrendingDown className="w-4 h-4" /> Withdraw</Button>} />

        <FilterBar>
          <SearchableDropdown
            label="Broker"
            value={selectedBroker}
            onChange={setSelectedBroker}
            options={brokerNames}
            placeholder="All Brokers"
            className="min-w-[160px] sm:min-w-[200px]"
          />
          <ModernDatePicker label="Start date" value={dateFrom} onChange={setDateFrom} placeholder="Start" className="min-w-[140px]" />
          <ModernDatePicker label="End date" value={dateTo} onChange={setDateTo} placeholder="End" className="min-w-[140px]" />
          {selectedBroker && totalFromSelectedBroker !== null && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary-50 border border-primary-100 px-4 py-2.5">
              <span className="text-sm text-gray-600">Total from</span>
              <span className="text-sm font-semibold text-primary-700">{selectedBroker}</span>
              <span className="text-primary-500">·</span>
              <span className="text-base font-bold text-primary-600">{formatMoney(totalFromSelectedBroker)}</span>
            </div>
          )}
        </FilterBar>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              valueClassName={card.valueClassName}
              icon={<card.Icon className="w-5 h-5" />}
              iconClassName={card.iconClassName}
              borderClassName={card.borderClassName}
            />
          ))}
        </div>

        <Tabs
          tabs={[
            { id: 'contrib', label: 'Contribution history' },
            { id: 'withdraw', label: 'Withdrawal history' }
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
        >
          {activeTab === 'contrib' && (
            <DataTable
              data={filteredContributionHistory}
              columns={contributionColumns}
              title="Contribution history"
              isLoading={false}
              searchConfig={{
                enabled: true,
                placeholder: 'Search by broker, project, date...',
                searchFields: ['client', 'project', 'date']
              }}
              filters={[]}
              pagination={{ enabled: true, itemsPerPage: 10 }}
              emptyTitle="No contributions yet"
              emptyDescription="Add transactions to see 2% Impact Fund contributions here."
            />
          )}
          {activeTab === 'withdraw' && (
            <DataTable
              data={filteredWithdrawalRows}
              columns={withdrawalColumns}
              title="Withdrawal history"
              isLoading={isLoading}
              onEdit={openEditWithdrawal}
              onDelete={handleDeleteWithdrawal}
              searchConfig={{
                enabled: true,
                placeholder: 'Search by description...',
                searchFields: ['description']
              }}
              filters={[]}
              pagination={{ enabled: true, itemsPerPage: 10 }}
              emptyTitle="No withdrawals yet"
              emptyDescription="Use Withdraw to record a withdrawal from the Impact Fund."
            />
          )}
        </Tabs>
      </div>

      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => { setIsWithdrawModalOpen(false); setEditingWithdrawalId(null); setWithdrawError(''); }}
        title={editingWithdrawalId ? 'Edit Withdrawal' : 'Withdraw from Impact Fund'}
      >
        <form onSubmit={handleWithdrawSubmit} className="space-y-4">
          <div>
            <InputField
              label="Amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => {
                const val = e.target.value;
                setWithdrawAmount(val);
                const num = toNumber(val);
                if (num > maxWithdrawable) {
                  setWithdrawError(`Amount cannot exceed available balance (${formatMoney(maxWithdrawable)}).`);
                } else {
                  setWithdrawError('');
                }
              }}
              placeholder="0.00"
              required
              error={!!withdrawError}
            />
            {withdrawError && (
              <p className="text-sm text-red-600 mt-1" role="alert">{withdrawError}</p>
            )}
          </div>
          <TextareaField
            label="Description / Note"
            value={withdrawNote}
            onChange={(e) => setWithdrawNote(e.target.value)}
            placeholder="Optional note for this withdrawal..."
            rows={4}
          />
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { setIsWithdrawModalOpen(false); setEditingWithdrawalId(null); setWithdrawError(''); }}
              className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading || toNumber(withdrawAmount) <= 0 || toNumber(withdrawAmount) > maxWithdrawable}
            >
              {isLoading ? 'Saving...' : editingWithdrawalId ? 'Update' : 'Withdraw'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ImpactFund;
