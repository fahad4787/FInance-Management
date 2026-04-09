import { addMonths } from 'date-fns';
import { normalizeDateToYYYYMMDD } from './date';

export const isProjectEligibleForTransactions = (project, monthsAfterInactive = 2) => {
  if (!project) return false;
  const status = String(project.projectStatus || 'active').trim().toLowerCase();
  if (status === 'active') return true;
  if (status !== 'inactive') return true;

  const inactiveAt = normalizeDateToYYYYMMDD(project.inactiveAt);
  if (!inactiveAt) return false;

  const [y, m, d] = inactiveAt.split('-').map(Number);
  const inactiveDate = new Date(y, (m || 1) - 1, d || 1);
  if (Number.isNaN(inactiveDate.getTime())) return false;

  const until = addMonths(inactiveDate, monthsAfterInactive);
  const untilYmd = `${until.getFullYear()}-${String(until.getMonth() + 1).padStart(2, '0')}-${String(until.getDate()).padStart(2, '0')}`;
  const todayYmd = normalizeDateToYYYYMMDD(new Date());
  if (!todayYmd) return false;
  return todayYmd <= untilYmd;
};

