import { useMemo } from 'react';
import FormModal from './FormModal';
import { FiFileText, FiDollarSign, FiMessageSquare, FiCalendar } from 'react-icons/fi';

const defaultForm = {
  expenseName: '',
  date: '',
  expenseType: '',
  amount: '',
  comment: '',
  recurring: false,
  recurringMonths: ''
};

const expenseTypeOptions = [
  { value: 'rent', label: 'Rent' },
  { value: 'salaries', label: 'Salaries' },
  { value: 'general', label: 'General' },
  { value: 'fh', label: 'FH' },
  { value: 'software_tool', label: 'Software Tool' }
];

const recurringPeriodOptions = [
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 12, label: '12 months' },
  { value: 24, label: '24 months' },
  { value: 36, label: '36 months' }
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
      icon: <FiFileText className="w-5 h-5 text-gray-400" />,
      colSpan: (form) => form.expenseType === 'Software Tool' ? 4 : 1
    },
    {
      type: 'checkbox',
      name: 'recurring',
      label: 'Recurring',
      showWhen: (form) => form.expenseType === 'Software Tool'
    },
    {
      type: 'searchable-dropdown',
      name: 'recurringMonths',
      label: 'Recurring period',
      options: recurringPeriodOptions.map(opt => opt.label),
      placeholder: 'Type or select period...',
      icon: <FiCalendar className="w-5 h-5 text-gray-400" />,
      showWhen: (form) => form.expenseType === 'Software Tool' && !!form.recurring
    },
    {
      type: 'number',
      name: 'amount',
      label: 'Expense Amount',
      icon: <FiDollarSign className="w-5 h-5 text-gray-400" />,
      fullWidth: (form) => form.expenseType === 'Software Tool' && !form.recurring
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
    const isRecurring = values.expenseType === 'Software Tool' && !!values.recurring && !!values.recurringMonths;
    const expenseData = {
      ...values,
      expenseType: selectedOption ? selectedOption.value : values.expenseType || '',
      amount: Number(values.amount) || 0,
      ...(isRecurring && {
        recurring: true,
        recurringMonths: (recurringPeriodOptions.find(opt => opt.label === values.recurringMonths)?.value ?? Number(values.recurringMonths)) || 0
      })
    };
    if (!isRecurring) {
      delete expenseData.recurringMonths;
      delete expenseData.recurring;
    }
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
