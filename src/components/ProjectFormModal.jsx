import { useMemo } from 'react';
import FormModal from './FormModal';
import { FiUser } from 'react-icons/fi';
import { FaPercent } from 'react-icons/fa6';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';

const getDateSixMonthsFromNow = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().slice(0, 10);
};

const defaultForm = {
  client: '',
  date: '',
  project: '',
  projectType: 'Full time',
  projectStatus: 'active',
  totalMonthlyHours: '',
  hourlyRate: '',
  recruiterName: '',
  contractEnding: '',
  brokerageType: 'percentage',
  brokerageValue: '',
  taxAmount: ''
};

const ProjectFormModal = ({
  isOpen,
  onClose,
  title,
  clientOptions = [],
  projectTypeOptions = [],
  initialValues = defaultForm,
  onSubmit,
  isSaving = false,
  projects = []
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const contractEndingDefault = getDateSixMonthsFromNow();
  const normalizedInitialValues = {
    ...defaultForm,
    ...(initialValues || {}),
    date: (initialValues && initialValues.date) ? initialValues.date : today,
    projectType: (initialValues && initialValues.projectType !== undefined && initialValues.projectType !== '') ? initialValues.projectType : 'Full time',
    projectStatus: (initialValues && initialValues.projectStatus) ? initialValues.projectStatus : 'active',
    contractEnding: (initialValues && initialValues.contractEnding) ? initialValues.contractEnding : contractEndingDefault
  };

  const findLatestProjectByBroker = (brokerName) => {
    if (!brokerName || !projects || projects.length === 0) return null;
    
    const brokerProjects = projects
      .filter(p => p.client && p.client.trim().toLowerCase() === brokerName.trim().toLowerCase())
      .sort((a, b) => {
        const dateA = a.createdAt || a.date || '';
        const dateB = b.createdAt || b.date || '';
        return dateB.localeCompare(dateA);
      });
    
    return brokerProjects.length > 0 ? brokerProjects[0] : null;
  };

  const handleFieldChange = (form, fieldName, value) => {
    if (fieldName === 'client' && value) {
      const latestProject = findLatestProjectByBroker(value);
      if (latestProject) {
        form.brokerageValue = latestProject.brokerageValue || '';
        form.brokerageType = latestProject.brokerageType || 'percentage';
        form.taxAmount = latestProject.taxAmount ?? '';
      }
    }
    if (fieldName === 'projectType' && value === 'Full time') {
      form.contractEnding = '';
    }
    return form;
  };

  const fields = useMemo(() => [
    {
      type: 'searchable-dropdown',
      name: 'client',
      label: 'Broker',
      options: clientOptions,
      placeholder: clientOptions.length > 0 ? "Type or select broker..." : "Enter broker name...",
      icon: <FiUser className="w-5 h-5 text-gray-400" />
    },
    {
      type: 'text',
      name: 'project',
      label: 'Project Name'
    },
    {
      type: 'date',
      name: 'date',
      label: 'Date',
      defaultValue: today
    },
    {
      type: 'dropdown',
      name: 'projectType',
      label: 'Project Type',
      options: projectTypeOptions,
      hidePlaceholder: true
    },
    {
      type: 'dropdown',
      name: 'projectStatus',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      hidePlaceholder: true
    },
    {
      type: 'number',
      name: 'taxAmount',
      label: 'Tax amount ($)',
      placeholder: '0',
      icon: <HiOutlineCurrencyDollar className="w-5 h-5 text-gray-400" />
    },
    {
      type: 'date',
      name: 'contractEnding',
      label: 'End Date',
      defaultValue: getDateSixMonthsFromNow(),
      showWhen: (form) => form.projectType !== 'Full time'
    },
    {
      type: 'number',
      name: 'totalMonthlyHours',
      label: 'Total Monthly Hours'
    },
    {
      type: 'number',
      name: 'hourlyRate',
      label: 'Hourly Rates'
    },
    {
      type: 'text',
      name: 'recruiterName',
      label: 'Recruiter Name'
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
      dynamicLabel: (form) => form.brokerageType === 'percentage' ? "Brokerage (%)" : "Brokerage ($)",
      inputField: {
        name: 'brokerageValue',
        type: 'number',
        placeholder: (form) => form.brokerageType === 'percentage' ? "Enter percentage..." : "Enter amount...",
        icon: (form) => form.brokerageType === 'percentage'
          ? <FaPercent className="w-5 h-5 text-gray-400" />
          : <HiOutlineCurrencyDollar className="w-5 h-5 text-gray-400" />
      }
    }
  ], [clientOptions, projectTypeOptions, today]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      fields={fields}
      initialValues={normalizedInitialValues}
      onSubmit={onSubmit}
      isSaving={isSaving}
      onFieldChange={handleFieldChange}
      columnsPerRow={3}
    />
  );
};

export default ProjectFormModal;

