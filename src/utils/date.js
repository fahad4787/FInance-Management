/** Normalize date to YYYY-MM-DD (handles Firestore Timestamp, serialized timestamp, Date, string) */
export const normalizeDateToYYYYMMDD = (value) => {
  if (value == null || value === '') return '';
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    const d = value.toDate();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  if (typeof value === 'object' && typeof value.seconds === 'number') {
    const d = new Date(value.seconds * 1000);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }
  const str = String(value).trim();
  if (str.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return str.slice(0, 10);
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Return { from, to } as YYYY-MM-DD for the current month */
export const getThisMonthRange = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const from = `${y}-${String(m + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(y, m + 1, 0).getDate();
  const to = `${y}-${String(m + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { from, to };
};

/** Short month names for charts/labels */
export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Filter a list by date range (inclusive). getDate(item) should return the item's date (any format supported by normalizeDateToYYYYMMDD).
 */
export const filterByDateRange = (list, dateFrom, dateTo, getDate) => {
  if (!list || !Array.isArray(list)) return [];
  let result = list;
  if (dateFrom) {
    const from = normalizeDateToYYYYMMDD(dateFrom) || '';
    result = result.filter((item) => {
      const d = normalizeDateToYYYYMMDD(getDate(item));
      return d && d >= from;
    });
  }
  if (dateTo) {
    const to = normalizeDateToYYYYMMDD(dateTo) || '';
    result = result.filter((item) => {
      const d = normalizeDateToYYYYMMDD(getDate(item));
      return d && d <= to;
    });
  }
  return result;
};
