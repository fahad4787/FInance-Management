import { addMonths } from 'date-fns';
import { isFreelanceProject } from '../constants/projectTypes';
import { normalizeDateToYYYYMMDD } from './date';

export const isActiveProject = (project) =>
  String(project?.projectStatus || 'active').trim().toLowerCase() === 'active';

export const isProjectEligibleForAutoGenerateMonth = (project, monthStart, monthEnd) => {
  if (!project || isFreelanceProject(project)) return false;

  const startYmd = normalizeDateToYYYYMMDD(project.date);
  const rangeStart = normalizeDateToYYYYMMDD(monthStart);
  const rangeEnd = normalizeDateToYYYYMMDD(monthEnd);
  if (!startYmd || !rangeStart || !rangeEnd) return false;
  if (rangeEnd < startYmd) return false;

  const contractEnd = normalizeDateToYYYYMMDD(project.contractEnding);
  if (contractEnd && rangeStart > contractEnd) return false;

  const status = String(project.projectStatus || 'active').trim().toLowerCase();
  if (status === 'active') return true;

  if (status === 'inactive') {
    const inactiveAt = normalizeDateToYYYYMMDD(project.inactiveAt);
    if (!inactiveAt) return !contractEnd || rangeStart <= contractEnd;
    const monthKey = rangeStart.slice(0, 7);
    const inactiveMonth = inactiveAt.slice(0, 7);
    return monthKey <= inactiveMonth;
  }

  return true;
};

export const isProjectEligibleForTransactions = (project, monthsAfterInactive = 2) => {
  if (!project) return false;
  if (isFreelanceProject(project)) return false;
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

