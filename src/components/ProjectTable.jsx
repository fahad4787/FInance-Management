import DataTable from './DataTable';
import { FiUser } from 'react-icons/fi';

const ProjectTable = ({ projects, onDelete, onEdit, isLoading = false, title = 'Saved Projects' }) => {
  const columns = [
    { key: 'client', label: 'Broker' },
    { key: 'date', label: 'Date' },
    { key: 'project', label: 'Project Name' },
    {
      key: 'projectType',
      label: 'Project Type',
      render: (value) => {
        if (!value) return '-';
        const typeColors = {
          'Full time': 'bg-blue-100 text-blue-800',
          'Part time': 'bg-green-100 text-green-800',
          'Contract': 'bg-purple-100 text-purple-800'
        };
        const colorClass = typeColors[value] || 'bg-gray-100 text-gray-800';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'totalMonthlyHours', label: 'Monthly Hours' },
    { key: 'hourlyRate', label: 'Hourly Rate' },
    { key: 'recruiterName', label: 'Recruiter Name' },
    { key: 'contractEnding', label: 'Contract Ending' },
    {
      key: 'brokerage',
      label: 'Brokerage',
      render: (_, project) => {
        if (!project.brokerageValue) return '-';
        return project.brokerageType === 'percentage'
          ? `${project.brokerageValue}%`
          : `$${project.brokerageValue}`;
      }
    }
  ];

  const searchConfig = {
    enabled: true,
    placeholder: 'Search by broker, date, project name, type, or recruiter...',
    searchFields: ['client', 'project', 'projectType', 'recruiterName', 'date', 'contractEnding']
  };

  const filters = [
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
      pagination={{ enabled: true, itemsPerPage: 5 }}
    />
  );
};

export default ProjectTable;
