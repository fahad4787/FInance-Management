import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseFormModal from '../components/ExpenseFormModal';
import {
  createExpense,
  editExpense,
  fetchExpenses,
  removeExpense
} from '../store/expenses/expensesSlice';

const defaultForm = {
  expenseName: '',
  date: '',
  expenseType: '',
  amount: '',
  comment: ''
};

const Expenses = () => {
  const dispatch = useDispatch();

  const expenses = useSelector((state) => state.expenses.items);
  const isLoading = useSelector((state) => state.expenses.isLoading);
  const error = useSelector((state) => state.expenses.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [initialValues, setInitialValues] = useState(defaultForm);

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
    const typeLabels = {
      'rent': 'Rent',
      'salaries': 'Salaries',
      'general': 'General'
    };
    const expenseTypeLabel = typeLabels[expense.expenseType?.toLowerCase()] || expense.expenseType || '';
    setInitialValues({
      ...defaultForm,
      expenseName: expense.expenseName || '',
      date: expense.date || '',
      expenseType: expenseTypeLabel,
      amount: expense.amount ?? '',
      comment: expense.comment || ''
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
        <PageHeader
          title="Expenses"
          actions={<Button onClick={openAddModal}>Add Expense</Button>}
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        <ExpenseTable
          expenses={expenses}
          onDelete={onDelete}
          onEdit={openEditModal}
          isLoading={isLoading}
          title="Expense Details"
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
