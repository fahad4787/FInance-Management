import { addMonths, subDays, startOfDay, format } from 'date-fns';
import { normalizeDateToYYYYMMDD } from './date';
import { isApproved } from '../constants/app';

const inRange = (ymd, start, end) => Boolean(ymd && start && end && ymd >= start && ymd <= end);

const isInactiveProject = (p) =>
  String(p?.projectStatus || 'active').trim().toLowerCase() === 'inactive';

const inactiveRecordedYmd = (p) => {
  if (!isInactiveProject(p)) return '';
  const fromInactiveAt = normalizeDateToYYYYMMDD(p.inactiveAt);
  if (fromInactiveAt) return fromInactiveAt;
  return normalizeDateToYYYYMMDD(p.updatedAt);
};

const countForWindows = (projects, currStartYmd, currEndYmd, prevStartYmd, prevEndYmd) => {
  let onboardCurr = 0;
  let onboardPrev = 0;
  let endedCurr = 0;
  let endedPrev = 0;
  for (const p of projects) {
    const onboard = normalizeDateToYYYYMMDD(p.date);
    const ended = inactiveRecordedYmd(p);
    if (inRange(onboard, currStartYmd, currEndYmd)) onboardCurr += 1;
    if (inRange(onboard, prevStartYmd, prevEndYmd)) onboardPrev += 1;
    if (inRange(ended, currStartYmd, currEndYmd)) endedCurr += 1;
    if (inRange(ended, prevStartYmd, prevEndYmd)) endedPrev += 1;
  }
  return { onboardCurr, onboardPrev, endedCurr, endedPrev };
};

/**
 * Rolling 3-month window (ending today) vs the prior 3 months.
 */
export function computeRollingWindowStats(projects = []) {
  const today = startOfDay(new Date());
  const currStart = addMonths(today, -3);
  const currEnd = today;
  const prevEnd = subDays(currStart, 1);
  const prevStart = addMonths(currStart, -3);

  const currStartYmd = normalizeDateToYYYYMMDD(currStart);
  const currEndYmd = normalizeDateToYYYYMMDD(currEnd);
  const prevStartYmd = normalizeDateToYYYYMMDD(prevStart);
  const prevEndYmd = normalizeDateToYYYYMMDD(prevEnd);

  const approved = (projects || []).filter(isApproved);
  const counts = countForWindows(approved, currStartYmd, currEndYmd, prevStartYmd, prevEndYmd);

  return {
    rangeLabel: `${format(currStart, 'MMM d')} – ${format(currEnd, 'MMM d, yyyy')}`,
    onboardCurr: counts.onboardCurr,
    onboardPrev: counts.onboardPrev,
    endedCurr: counts.endedCurr,
    endedPrev: counts.endedPrev
  };
}
