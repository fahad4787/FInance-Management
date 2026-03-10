export const PROJECT_TYPE_OPTIONS = [
  { value: 'Full time', label: 'Full time' },
  { value: 'Part time', label: 'Part time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Freelance', label: 'Freelance' }
];

export const PROJECT_TYPE_LABELS = PROJECT_TYPE_OPTIONS.map((o) => o.label);

export const DASHBOARD_ACTIVE_PROJECT_TYPES = ['Full time', 'Part time', 'Contract'];

export const isDashboardActiveProject = (project) => {
  const status = project?.projectStatus || 'active';
  const type = (project?.projectType || '').trim();
  return status === 'active' && DASHBOARD_ACTIVE_PROJECT_TYPES.includes(type);
};

export const PROJECT_TYPE_COLORS = {
  'Full time': 'bg-blue-100 text-blue-800',
  'Part time': 'bg-green-100 text-green-800',
  Contract: 'bg-purple-100 text-purple-800',
  Freelance: 'bg-amber-100 text-amber-800'
};
