import { PERSON_BADGE_COLORS } from '../constants/projectAssignments';

const PersonBadge = ({ name }) => {
  const label = String(name || '').trim();
  if (!label) return '-';
  const colorClass = PERSON_BADGE_COLORS[label] || 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  );
};

export default PersonBadge;
