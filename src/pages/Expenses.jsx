import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ModernDatePicker from '../components/ModernDatePicker';
import FilterBar from '../components/FilterBar';
import SearchableDropdown from '../components/SearchableDropdown';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseFormModal from '../components/ExpenseFormModal';
import {
  createExpense,
  editExpense,
  fetchExpenses,
  removeExpense
} from '../store/expenses/expensesSlice';
import { normalizeDateToYYYYMMDD, getThisMonthRange } from '../utils/date';

const expenseTypeLabelToValue = { Rent: 'rent', Salaries: 'salaries', General: 'general', FH: 'fh', 'Software Tool': 'software_tool' };
const expenseTypeOptions = ['Rent', 'Salaries', 'General', 'FH', 'Software Tool'];

const defaultForm = {
  expenseName: '',
  date: '',
  expenseType: '',
  amount: '',
  comment: '',
  recurring: false,
  recurringMonths: ''
};

const Expenses = () => {
  const dispatch = useDispatch();

  const expenses = useSelector((state) => state.expenses.items);
  const isLoading = useSelector((state) => state.expenses.isLoading);
  const error = useSelector((state) => state.expenses.error);

  const { from: defaultFrom, to: defaultTo } = getThisMonthRange();
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [selectedType, setSelectedType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [initialValues, setInitialValues] = useState(defaultForm);

  const filteredExpenses = useMemo(() => {
    let list = expenses || [];
    if (dateFrom) {
      const from = normalizeDateToYYYYMMDD(dateFrom);
      list = list.filter((e) => {
        const d = normalizeDateToYYYYMMDD(e.date);
        return d && d >= from;
      });
    }
    if (dateTo) {
      const to = normalizeDateToYYYYMMDD(dateTo);
      list = list.filter((e) => {
        const d = normalizeDateToYYYYMMDD(e.date);
        return d && d <= to;
      });
    }
    if (selectedType) {
      const typeValue = expenseTypeLabelToValue[selectedType];
      list = list.filter((e) => (e.expenseType || '').toLowerCase() === typeValue);
    }
    return list;
  }, [expenses, dateFrom, dateTo, selectedType]);

  useEffect(() => {
    document.title = 'Expenses | FinHub';
  }, []);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const openAddModal = () => {
    setEditingExpenseId(null);
    setInitialValues(defaultForm);
    setIsModalOpen(true);
  };

  const recurringMonthsToLabel = {
    3: '3 months',
    6: '6 months',
    12: '12 months',
    24: '24 months',
    36: '36 months'
  };

  const openEditModal = (expense, expenseId) => {
    setEditingExpenseId(expenseId);
    const typeLabels = {
      'rent': 'Rent',
      'salaries': 'Salaries',
      'general': 'General',
      'fh': 'FH',
      'software_tool': 'Software Tool'
    };
    const expenseTypeLabel = typeLabels[expense.expenseType?.toLowerCase()] || expense.expenseType || '';
    setInitialValues({
      ...defaultForm,
      expenseName: expense.expenseName || '',
      date: expense.date || '',
      expenseType: expenseTypeLabel,
      amount: expense.amount ?? '',
      comment: expense.comment || '',
      recurring: !!expense.recurring,
      recurringMonths: recurringMonthsToLabel[expense.recurringMonths] ?? expense.recurringMonths ?? ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onSubmit = async (expenseData) => {
    if (editingExpenseId) {
      await dispatch(
        editExpense({ expenseId: editingExpenseId, expenseData })
      ).unwrap();
      setEditingExpenseId(null);
    } else {
      await dispatch(createExpense(expenseData)).unwrap();
    }

    setIsModalOpen(false);
  };

  const onDelete = async (expenseId) => {
    await dispatch(removeExpense(expenseId)).unwrap();
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="w-full space-y-8">
        <PageHeader title="Expenses" actions={<Button onClick={openAddModal}>Add Expense</Button>} />

        <FilterBar>
          <SearchableDropdown
            label="Type"
            value={selectedType}
            onChange={setSelectedType}
            options={expenseTypeOptions}
            placeholder="All Types"
            className="min-w-[160px] sm:min-w-[200px]"
          />
          <ModernDatePicker label="Start date" value={dateFrom} onChange={setDateFrom} placeholder="Start" className="min-w-[140px]" />
          <ModernDatePicker label="End date" value={dateTo} onChange={setDateTo} placeholder="End" className="min-w-[140px]" />
        </FilterBar>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        <ExpenseTable
          expenses={filteredExpenses}
          onDelete={onDelete}
          onEdit={openEditModal}
          isLoading={isLoading}
          title="Expense Details"
          hideFilters={['expenseType']}
        />
      </div>

      <ExpenseFormModal
        key={editingExpenseId || 'new'}
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExpenseId ? 'Edit Expense' : 'Add Expense'}
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSaving={isLoading}
      />
    </div>
  );
};

export default Expenses;
