import { useMemo } from 'react';
import FormModal from './FormModal';
import { FiUser, FiFileText, FiDollarSign } from 'react-icons/fi';
import { FaPercent } from 'react-icons/fa6';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';

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

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const computeBrokerageAmount = ({ amount, brokerageType, brokerageValue }) => {
  const a = toNumber(amount);
  const b = toNumber(brokerageValue);
  if (brokerageType === 'percentage') return (a * b) / 100;
  return b;
};

const computeTotalAmount = ({ amount, brokerageAmount, additionalCharges, brokerageType, brokerageValue }) => {
  const a = toNumber(amount);
  const bAmt = brokerageAmount !== '' && brokerageAmount !== null && brokerageAmount !== undefined
    ? toNumber(brokerageAmount)
    : computeBrokerageAmount({ amount, brokerageType, brokerageValue });
  const charges = toNumber(additionalCharges);
  return a - bAmt - charges;
};

const formatMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return '$0.00';
  return `$${n.toFixed(2)}`;
};

const TransactionFormModal = ({
  isOpen,
  onClose,
  title,
  initialValues = defaultForm,
  onSubmit,
  isSaving = false,
  projects = [],
  clientOptions = []
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const normalizedInitialValues = {
    ...defaultForm,
    ...(initialValues || {}),
    date: (initialValues && initialValues.date) ? initialValues.date : today
  };

  const uniqueProjectsForBroker = (broker, currentProjects) => {
    if (!broker) return [];
    const items = currentProjects
      .filter((p) => (p.client || '').trim().toLowerCase() === broker.trim().toLowerCase())
      .map((p) => p.project)
      .filter(Boolean)
      .map((p) => String(p).trim())
      .filter(Boolean);
    return [...new Set(items)].sort();
  };

  const findLatestProjectByBrokerAndProject = (broker, projectName) => {
    if (!broker || !projectName || !projects?.length) return null;
    const matches = projects
      .filter((p) =>
        (p.client || '').trim().toLowerCase() === broker.trim().toLowerCase() &&
        (p.project || '').trim().toLowerCase() === projectName.trim().toLowerCase()
      )
      .sort((a, b) => {
        const dateA = a.createdAt || a.date || '';
        const dateB = b.createdAt || b.date || '';
        return dateB.localeCompare(dateA);
      });
    return matches[0] || null;
  };

  const handleFieldChange = (form, fieldName, value) => {
    if (fieldName === 'client') {
      form.project = '';
    }

    if (fieldName === 'project' && form.client && value) {
      const latest = findLatestProjectByBrokerAndProject(form.client, value);
      if (latest) {
        form.brokerageType = latest.brokerageType || 'percentage';
        form.brokerageValue = latest.brokerageValue || '';
      }
    }

    if (
      fieldName === 'amount' ||
      fieldName === 'brokerageType' ||
      fieldName === 'brokerageValue' ||
      fieldName === 'additionalCharges'
    ) {
      const brokerageAmount = computeBrokerageAmount(form);
      form.brokerageAmount = brokerageAmount ? brokerageAmount.toFixed(2) : '';
    }

    return form;
  };

  const fields = useMemo(() => [
    {
      type: 'searchable-dropdown',
      name: 'client',
      label: 'Broker',
      options: clientOptions,
      placeholder: clientOptions.length > 0 ? 'Type or select broker...' : 'Enter broker name...',
      icon: <FiUser className="w-5 h-5 text-gray-400" />
    },
    {
      type: 'searchable-dropdown',
      name: 'project',
      label: 'Project Name',
      options: (form) => uniqueProjectsForBroker(form.client, projects),
      placeholder: (form) => form.client ? 'Type or select project...' : 'Select broker first...',
      icon: <FiFileText className="w-5 h-5 text-gray-400" />
    },
    {
      type: 'date',
      name: 'date',
      label: 'Date',
      defaultValue: today
    },
    {
      type: 'number',
      name: 'amount',
      label: 'Amount',
      icon: <FiDollarSign className="w-5 h-5 text-gray-400" />
    },
    {
      type: 'radio-group',
      name: 'brokerageType',
      label: 'Brokerage',
      options: [
        { value: 'percentage', label: 'Percentage' },
        { value: 'fixed', label: 'Fixed Amount' }
      ],
      defaultValue: 'percentage',
      dynamicLabel: (form) => form.brokerageType === 'percentage' ? 'Brokerage (%)' : 'Brokerage ($)',
      inputField: {
        name: 'brokerageValue',
        type: 'number',
        placeholder: (form) => form.brokerageType === 'percentage' ? 'Enter percentage...' : 'Enter amount...',
        icon: (form) => form.brokerageType === 'percentage'
          ? <FaPercent className="w-5 h-5 text-gray-400" />
          : <HiOutlineCurrencyDollar className="w-5 h-5 text-gray-400" />
      },
      inlineInput: true
    },
    {
      type: 'number',
      name: 'additionalCharges',
      label: 'Additional Charges',
      icon: <FiDollarSign className="w-5 h-5 text-gray-400" />
    },
    {
      type: 'summary',
      name: 'netTotalSummary',
      label: 'Summary',
      fullWidth: true,
      render: (form) => {
        const amount = toNumber(form.amount);
        const brokerageAmount = computeBrokerageAmount(form);
        const additionalCharges = toNumber(form.additionalCharges);
        const totalAmount = computeTotalAmount({ ...form, brokerageAmount });

        const brokerageLabel =
          form.brokerageType === 'percentage'
            ? `Brokerage (${toNumber(form.brokerageValue)}%)`
            : 'Brokerage (Fixed)';

        return (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Amount</span>
              <span className="text-gray-900 font-semibold">{formatMoney(amount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">(-) {brokerageLabel}</span>
              <span className="text-gray-900 font-semibold">{formatMoney(brokerageAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">(-) Additional Charges</span>
              <span className="text-gray-900 font-semibold">{formatMoney(additionalCharges)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
              <span className="text-gray-900 font-semibold">Total Amount (Net)</span>
              <span className="text-primary-700 font-bold text-lg">{formatMoney(totalAmount)}</span>
            </div>
          </div>
        );
      }
    }
  ], [clientOptions, projects, today]);

  const handleSubmit = async (values) => {
    const brokerageAmount = computeBrokerageAmount(values);
    const totalAmount = computeTotalAmount({ ...values, brokerageAmount });
    const transactionData = {
      ...values,
      brokerageAmount: brokerageAmount ? Number(brokerageAmount.toFixed(2)) : 0,
      totalAmount: Number.isFinite(totalAmount) ? Number(totalAmount.toFixed(2)) : 0,
      amount: toNumber(values.amount),
      brokerageValue: toNumber(values.brokerageValue),
      additionalCharges: toNumber(values.additionalCharges)
    };
    await onSubmit?.(transactionData);
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
      onFieldChange={handleFieldChange}
    />
  );
};

export default TransactionFormModal;

