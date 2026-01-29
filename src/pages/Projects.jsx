import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, editProject, fetchProjects, removeProject } from '../store/projects/projectsSlice';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ProjectTable from '../components/ProjectTable';
import ProjectFormModal from '../components/ProjectFormModal';

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items);
  const isLoading = useSelector((state) => state.projects.isLoading);
  const error = useSelector((state) => state.projects.error);

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
        <PageHeader
          title="Projects"
          actions={
            <Button onClick={openAddModal}>Add Project</Button>
          }
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        <ProjectTable
          projects={projects}
          onDelete={onDelete}
          onEdit={openEditModal}
          isLoading={isLoading}
          title="Project Details"
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

