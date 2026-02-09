import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, editProject, fetchProjects, removeProject } from '../store/projects/projectsSlice';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ModernDatePicker from '../components/ModernDatePicker';
import FilterBar from '../components/FilterBar';
import SearchableDropdown from '../components/SearchableDropdown';
import ProjectTable from '../components/ProjectTable';
import ProjectFormModal from '../components/ProjectFormModal';
import { normalizeDateToYYYYMMDD, getThisMonthRange } from '../utils/date';

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items);
  const isLoading = useSelector((state) => state.projects.isLoading);
  const error = useSelector((state) => state.projects.error);

  const projectTypeLabels = ['Full time', 'Part time', 'Contract'];

  const { from: defaultFrom, to: defaultTo } = getThisMonthRange();
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [initialValues, setInitialValues] = useState({
    client: '',
    date: '',
    project: '',
    projectType: '',
    totalMonthlyHours: '',
    hourlyRate: '',
    recruiterName: '',
    contractEnding: '',
    brokerageType: 'percentage',
    brokerageValue: ''
  });

  const filteredProjects = useMemo(() => {
    let list = projects || [];
    if (dateFrom) {
      const from = normalizeDateToYYYYMMDD(dateFrom);
      list = list.filter((p) => {
        const d = normalizeDateToYYYYMMDD(p.date);
        return d && d >= from;
      });
    }
    if (dateTo) {
      const to = normalizeDateToYYYYMMDD(dateTo);
      list = list.filter((p) => {
        const d = normalizeDateToYYYYMMDD(p.date);
        return d && d <= to;
      });
    }
    if (selectedBroker) {
      list = list.filter((p) => (p.client || '').trim() === selectedBroker);
    }
    if (selectedProjectType) {
      list = list.filter((p) => (p.projectType || '').trim() === selectedProjectType);
    }
    return list;
  }, [projects, dateFrom, dateTo, selectedBroker, selectedProjectType]);

  useEffect(() => {
    document.title = 'Projects | FinHub';
  }, []);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const projectTypeOptions = [
    { value: 'Full time', label: 'Full time' },
    { value: 'Part time', label: 'Part time' },
    { value: 'Contract', label: 'Contract' }
  ];

  const clientOptions = useMemo(() => {
    const clients = projects
      .map(p => p.client)
      .filter(Boolean)
      .map((c) => String(c).trim())
      .filter(Boolean);
    return [...new Set(clients)].sort();
  }, [projects]);

  const openAddModal = () => {
    setEditingProjectId(null);
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    const contractEndingDefault = d.toISOString().slice(0, 10);
    setInitialValues({
      client: '',
      date: '',
      project: '',
      projectType: '',
      totalMonthlyHours: '',
      hourlyRate: '',
      recruiterName: '',
      contractEnding: contractEndingDefault,
      brokerageType: 'percentage',
      brokerageValue: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project, projectId) => {
    setEditingProjectId(projectId);
    setInitialValues({
      client: project.client || '',
      date: project.date || '',
      project: project.project || '',
      projectType: project.projectType || '',
      totalMonthlyHours: project.totalMonthlyHours || '',
      hourlyRate: project.hourlyRate || '',
      recruiterName: project.recruiterName || '',
      contractEnding: project.contractEnding || '',
      brokerageType: project.brokerageType || 'percentage',
      brokerageValue: project.brokerageValue || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onSubmit = async (values) => {
    const projectData = {
      ...values
    };

    if (editingProjectId) {
      await dispatch(editProject({ projectId: editingProjectId, projectData })).unwrap();
      setEditingProjectId(null);
    } else {
      await dispatch(createProject(projectData)).unwrap();
    }

    setIsModalOpen(false);
  };

  const onDelete = async (projectId) => {
    await dispatch(removeProject(projectId)).unwrap();
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="w-full space-y-8">
        <PageHeader title="Projects" actions={<Button onClick={openAddModal}>Add Project</Button>} />

        <FilterBar>
          <SearchableDropdown
            label="Broker"
            value={selectedBroker}
            onChange={setSelectedBroker}
            options={clientOptions}
            placeholder="All Brokers"
            className="min-w-[160px] sm:min-w-[200px]"
          />
          <SearchableDropdown
            label="Project Type"
            value={selectedProjectType}
            onChange={setSelectedProjectType}
            options={projectTypeLabels}
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

        <ProjectTable
          projects={filteredProjects}
          onDelete={onDelete}
          onEdit={openEditModal}
          isLoading={isLoading}
          title="Project Details"
          hideFilters={['client', 'projectType']}
        />
      </div>

      <ProjectFormModal
        key={editingProjectId || 'new'}
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProjectId ? 'Edit Project' : 'Add Project'}
        clientOptions={clientOptions}
        projectTypeOptions={projectTypeOptions}
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSaving={isLoading}
        projects={projects}
      />
    </div>
  );
};

export default Projects;

