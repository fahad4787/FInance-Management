import { useState } from 'react';
import { getPreviousMonthRange } from '../utils/date';

/**
 * Shared hook for date range filter state. Defaults to previous month (for viewing/entering previous month data in current month).
 */
export const useDateFilter = () => {
  const { from: defaultFrom, to: defaultTo } = getPreviousMonthRange();
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  return { dateFrom, setDateFrom, dateTo, setDateTo, defaultFrom, defaultTo };
};
