import DataTable from './DataTable';
import { FiUser } from 'react-icons/fi';
import { PROJECT_TYPE_COLORS } from '../constants/projectTypes';
import { isContractEndingWithinMonthsBefore } from '../utils/date';
import { formatMoney } from '../utils/format';

const ProjectTable = ({ projects, onDelete, onEdit, isLoading = false, title = 'Saved Projects', additionalFilters = null, hideFilters = [] }) => {
  const columns = [
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
    },
    {
      key: 'taxAmount',
      label: 'Tax',
      render: (value) => {
        const n = Number(value);
        if (value === '' || value == null || !Number.isFinite(n) || n === 0) return '-';
        return formatMoney(n);
      }
    }
  ];

  const searchConfig = {
    enabled: true,
    placeholder: 'Search by broker, date, project name, type, or recruiter...',
    searchFields: ['client', 'project', 'projectType', 'recruiterName', 'date', 'contractEnding']
  };

  const allFilters = [
    {
      key: 'client',
      label: 'Broker',
      type: 'searchable',
      placeholder: 'All Brokers',
      icon: <FiUser className="w-5 h-5 text-gray-400" />
    },
    {
      key: 'projectType',
      label: 'Project Type',
      type: 'dropdown'
    }
  ];
  const filters = hideFilters.length ? allFilters.filter((f) => !hideFilters.includes(f.key)) : allFilters;

  const getRowClassName = (project) =>
    isContractEndingWithinMonthsBefore(project.contractEnding, 2)
      ? 'bg-rose-50/90 hover:bg-rose-100/80 border-l-[3px] border-l-rose-400/90'
      : '';

  return (
    <DataTable
      data={projects}
      columns={columns}
      title={title}
      isLoading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      searchConfig={searchConfig}
      filters={filters}
      additionalFilters={additionalFilters}
      getRowClassName={getRowClassName}
    />
  );
};

export default ProjectTable;
