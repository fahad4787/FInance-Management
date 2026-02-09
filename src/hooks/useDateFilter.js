import { useState } from 'react';
import { getThisMonthRange } from '../utils/date';

/**
 * Shared hook for date range filter state. Returns default current-month range and setters.
 */
export const useDateFilter = () => {
  const { from: defaultFrom, to: defaultTo } = getThisMonthRange();
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  return { dateFrom, setDateFrom, dateTo, setDateTo, defaultFrom, defaultTo };
};
