import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiMenu, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { fetchProjects } from '../store/projects/projectsSlice';
import { formatMoney } from '../utils/format';
import { isApproved } from '../constants/app';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const projectKey = (p) => `${(p.client || '').trim().toLowerCase()}|${(p.project || '').trim().toLowerCase()}`;

const getProjectCost = (p) => {
  const hours = toNumber(p.totalMonthlyHours);
  const rate = toNumber(p.hourlyRate);
  const gross = hours * rate;
  const isPercentage = (p.brokerageType || 'percentage') === 'percentage';
  const brokerage = isPercentage ? gross * (toNumber(p.brokerageValue) / 100) : toNumber(p.brokerageValue);
  return Math.max(0, gross - brokerage);
};

const ProjectCard = ({ project, isDragging, onDragStart, onDragEnd, moveButton }) => (
  <div
    draggable
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    className={`flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 bg-white shadow-panel cursor-grab active:cursor-grabbing transition-all hover:border-primary-300 hover:shadow-md select-none ${isDragging ? 'opacity-60 scale-95' : ''}`}
  >
    <span className="text-slate-400 shrink-0 pointer-events-none">
      <FiMenu className="w-5 h-5" />
    </span>
    <div className="min-w-0 flex-1 pointer-events-none">
      <p className="font-semibold text-slate-800 truncate">{project.project || 'Unnamed'}</p>
      <p className="text-sm text-slate-500 truncate">{project.client || '—'}</p>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <span className="font-bold text-primary-600 pointer-events-none">{formatMoney(project.cost)}</span>
      {moveButton && (
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClick={() => moveButton.onClick(project.key)}
          title={moveButton.title}
          aria-label={moveButton.title}
          className="pointer-events-auto p-2 rounded-xl border border-primary-200/80 bg-primary-50/60 text-primary-700 hover:bg-primary-100 transition-colors"
        >
          {moveButton.icon}
        </button>
      )}
    </div>
  </div>
);

const DropZone = ({ children, onDragOver, onDrop, onDragLeave, isOver, label }) => (
  <div
    onDragOver={onDragOver}
    onDrop={onDrop}
    onDragLeave={onDragLeave}
    className={`relative flex-1 min-h-[320px] rounded-2xl border-2 border-dashed p-4 transition-colors ${
      isOver ? 'border-primary-500 bg-primary-50/50 z-10' : 'border-slate-200 bg-slate-50/50'
    }`}
  >
    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{label}</p>
    <div className="space-y-3">{children}</div>
  </div>
);

const ProjectAllocation = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items);
  const isLoading = useSelector((state) => state.projects.isLoading);
  const error = useSelector((state) => state.projects.error);

  const [allocatedKeys, setAllocatedKeys] = useState([]);
  const [draggedKey, setDraggedKey] = useState(null);
  const [dragOverZone, setDragOverZone] = useState(null);

  useEffect(() => {
    document.title = 'Project Allocation | FinHub';
  }, []);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const projectsWithCost = useMemo(() => {
    const list = (projects || []).filter(isApproved).filter((p) => (p.projectStatus || 'active') === 'active');
    return list
      .map((p) => {
        const key = projectKey(p);
        const cost = getProjectCost(p);
        return { ...p, key, cost };
      })
      .filter((p) => p.cost > 0);
  }, [projects]);

  const totalAmount = useMemo(() => projectsWithCost.reduce((s, p) => s + p.cost, 0), [projectsWithCost]);

  const { leftItems, rightItems, allocatedSum } = useMemo(() => {
    const allocatedSet = new Set(allocatedKeys);
    const left = projectsWithCost.filter((p) => !allocatedSet.has(p.key));
    const right = allocatedKeys
      .map((k) => projectsWithCost.find((p) => p.key === k))
      .filter(Boolean);
    const sum = right.reduce((s, p) => s + p.cost, 0);
    return { leftItems: left, rightItems: right, allocatedSum: sum };
  }, [projectsWithCost, allocatedKeys]);

  const remainingAmount = totalAmount - allocatedSum;

  const handleDragStart = useCallback((e, key) => {
    setDraggedKey(key);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', key);
    e.dataTransfer.setData('application/json', JSON.stringify({ key }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedKey(null);
    setDragOverZone(null);
  }, []);

  const handleDragOver = useCallback((e, zone) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverZone(zone);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverZone(null);
  }, []);

  const handleDropLeft = useCallback(
    (e) => {
      e.preventDefault();
      setDragOverZone(null);
      setDraggedKey(null);
      const key = e.dataTransfer.getData('text/plain');
      if (!key) return;
      setAllocatedKeys((prev) => prev.filter((k) => k !== key));
    },
    []
  );

  const handleDropRight = useCallback(
    (e) => {
      e.preventDefault();
      setDragOverZone(null);
      setDraggedKey(null);
      const key = e.dataTransfer.getData('text/plain');
      if (!key || allocatedKeys.includes(key)) return;
      setAllocatedKeys((prev) => [...prev, key]);
    },
    [allocatedKeys]
  );

  const moveToInactive = useCallback((key) => {
    setDragOverZone(null);
    setDraggedKey(null);
    setAllocatedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, []);

  const moveToActive = useCallback((key) => {
    setDragOverZone(null);
    setDraggedKey(null);
    setAllocatedKeys((prev) => prev.filter((k) => k !== key));
  }, []);

  if (isLoading && !projects?.length) {
    return (
      <PageContainer>
        <PageHeader title="Project Allocation" />
        <div className="flex items-center justify-center py-24">
          <Loader />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Project Allocation" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Monthly Amount"
          value={formatMoney(totalAmount)}
          icon={<FiDollarSign className="w-5 h-5" />}
          valueClassName="text-primary-600"
          iconClassName="text-primary-500"
          borderClassName="border-primary-500"
        />
        <StatCard
          label="If Inactive (expense)"
          value={formatMoney(allocatedSum)}
          icon={<FiPieChart className="w-5 h-5" />}
          valueClassName="text-amber-600"
          iconClassName="text-amber-500"
          borderClassName="border-amber-500"
        />
        <StatCard
          label="Remaining"
          value={formatMoney(remainingAmount)}
          icon={<FiTrendingUp className="w-5 h-5" />}
          valueClassName={remainingAmount >= 0 ? 'text-emerald-600' : 'text-red-600'}
          iconClassName={remainingAmount >= 0 ? 'text-emerald-500' : 'text-red-500'}
          borderClassName={remainingAmount >= 0 ? 'border-emerald-500' : 'border-red-500'}
        />
      </div>

      <ErrorAlert message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DropZone
          label={`Active projects (${leftItems.length}) — drag right to see expense if inactive`}
          onDragOver={(e) => handleDragOver(e, 'left')}
          onDrop={handleDropLeft}
          onDragLeave={handleDragLeave}
          isOver={dragOverZone === 'left'}
        >
          {leftItems.map((project) => (
            <ProjectCard
              key={project.key}
              project={project}
              isDragging={draggedKey === project.key}
              onDragStart={(e) => handleDragStart(e, project.key)}
              onDragEnd={handleDragEnd}
              moveButton={{
                icon: <FiArrowRight className="w-4 h-4" />,
                title: 'Move to If inactive',
                onClick: moveToInactive
              }}
            />
          ))}
        </DropZone>
        <DropZone
          label={`If inactive — expense (${rightItems.length}) · ${formatMoney(allocatedSum)}`}
          onDragOver={(e) => handleDragOver(e, 'right')}
          onDrop={handleDropRight}
          onDragLeave={handleDragLeave}
          isOver={dragOverZone === 'right'}
        >
          {rightItems.map((project) => (
            <ProjectCard
              key={project.key}
              project={project}
              isDragging={draggedKey === project.key}
              onDragStart={(e) => handleDragStart(e, project.key)}
              onDragEnd={handleDragEnd}
              moveButton={{
                icon: <FiArrowLeft className="w-4 h-4" />,
                title: 'Move back to Active',
                onClick: moveToActive
              }}
            />
          ))}
        </DropZone>
      </div>
    </PageContainer>
  );
};

export default ProjectAllocation;
