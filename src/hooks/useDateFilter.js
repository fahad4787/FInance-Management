import { useState, useCallback, useMemo } from 'react';
import { getYearRange } from '../utils/date';

const currentYear = new Date().getFullYear();

/**
 * Shared hook for date filter with modes: all (no filter), yearly (select year), or date range.
 * Default: empty dates, show all data.
 */
export const useDateFilter = () => {
  const [dateMode, setDateMode] = useState('range'); // 'all' | 'yearly' | 'range'
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const clearAll = useCallback(() => {
    setDateMode('all');
    setDateFrom('');
    setDateTo('');
    setSelectedYear(currentYear);
  }, []);

  const effectiveDateFrom = useMemo(() => {
    if (dateMode === 'all') return '';
    if (dateMode === 'yearly') return getYearRange(selectedYear).from;
    return dateFrom || '';
  }, [dateMode, selectedYear, dateFrom]);

  const effectiveDateTo = useMemo(() => {
    if (dateMode === 'all') return '';
    if (dateMode === 'yearly') return getYearRange(selectedYear).to;
    return dateTo || '';
  }, [dateMode, selectedYear, dateTo]);

  const setYearly = useCallback((year) => {
    setDateMode('yearly');
    setSelectedYear(year);
  }, []);

  const setRange = useCallback((from, to) => {
    setDateMode('range');
    setDateFrom(from || '');
    setDateTo(to || '');
  }, []);

  return {
    dateMode,
    setDateMode,
    selectedYear,
    setSelectedYear,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    clearAll,
    effectiveDateFrom,
    effectiveDateTo,
    setYearly,
    setRange
  };
};
