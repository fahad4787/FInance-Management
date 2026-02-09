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
import { filterByDateRange } from '../utils/date';
import { useDateFilter } from '../hooks/useDateFilter';
import { EXPENSE_TYPE_LABELS, EXPENSE_TYPE_LABEL_TO_VALUE, EXPENSE_TYPE_OPTIONS, RECURRING_MONTHS_LABELS } from '../constants/expenseTypes';

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

  const { dateFrom, setDateFrom, dateTo, setDateTo } = useDateFilter();
  const [selectedType, setSelectedType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [initialValues, setInitialValues] = useState(defaultForm);

  const filteredExpenses = useMemo(() => {
    let list = filterByDateRange(expenses || [], dateFrom, dateTo, (e) => e.date);
    if (selectedType) {
      const typeValue = EXPENSE_TYPE_LABEL_TO_VALUE[selectedType];
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

  const openEditModal = (expense, expenseId) => {
    setEditingExpenseId(expenseId);
    const expenseTypeLabel = EXPENSE_TYPE_LABELS[expense.expenseType?.toLowerCase()] || expense.expenseType || '';
    setInitialValues({
      ...defaultForm,
      expenseName: expense.expenseName || '',
      date: expense.date || '',
      expenseType: expenseTypeLabel,
      amount: expense.amount ?? '',
      comment: expense.comment || '',
      recurring: !!expense.recurring,
      recurringMonths: RECURRING_MONTHS_LABELS[expense.recurringMonths] ?? expense.recurringMonths ?? ''
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
            options={EXPENSE_TYPE_OPTIONS}
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
