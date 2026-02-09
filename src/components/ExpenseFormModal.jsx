import { useMemo } from 'react';
import FormModal from './FormModal';
import { FiFileText, FiDollarSign, FiMessageSquare } from 'react-icons/fi';

const defaultForm = {
  expenseName: '',
  date: '',
  expenseType: '',
  amount: '',
  comment: ''
};

const expenseTypeOptions = [
  { value: 'rent', label: 'Rent' },
  { value: 'salaries', label: 'Salaries' },
  { value: 'general', label: 'General' },
  { value: 'fh', label: 'FH' }
];

const ExpenseFormModal = ({
  isOpen,
  onClose,
  title,
  initialValues = defaultForm,
  onSubmit,
  isSaving = false
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const normalizedInitialValues = {
    ...defaultForm,
    ...(initialValues || {}),
    date: (initialValues && initialValues.date) ? initialValues.date : today
  };

  const fields = useMemo(() => [
    {
      type: 'text',
      name: 'expenseName',
      label: 'Expense Name',
      icon: <FiFileText className="w-5 h-5 text-gray-400" />
    },
    {
      type: 'date',
      name: 'date',
      label: 'Date',
      defaultValue: today
    },
    {
      type: 'searchable-dropdown',
      name: 'expenseType',
      label: 'Type of Expense',
      options: expenseTypeOptions.map(opt => opt.label),
      placeholder: 'Type or select expense type...',
      icon: <FiFileText className="w-5 h-5 text-gray-400" />
    },
    {
      type: 'number',
      name: 'amount',
      label: 'Expense Amount',
      icon: <FiDollarSign className="w-5 h-5 text-gray-400" />
    },
    {
      type: 'textarea',
      name: 'comment',
      label: 'Comment/Remark',
      fullWidth: true,
      rows: 4,
      icon: <FiMessageSquare className="w-5 h-5 text-gray-400" />
    }
  ], [today]);

  const handleSubmit = async (values) => {
    const selectedOption = expenseTypeOptions.find(opt => opt.label === values.expenseType);
    const expenseData = {
      ...values,
      expenseType: selectedOption ? selectedOption.value : values.expenseType || '',
      amount: Number(values.amount) || 0
    };
    await onSubmit?.(expenseData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      fields={fields}
      initialValues={normalizedInitialValues}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    />
  );
};

export default ExpenseFormModal;
