const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const getProjectMonthlyAllocationAmount = (p) => {
  const hours = toNumber(p.totalMonthlyHours);
  const rate = toNumber(p.hourlyRate);
  const gross = hours * rate;
  const isPercentage = (p.brokerageType || 'percentage') === 'percentage';
  const brokerage = isPercentage ? gross * (toNumber(p.brokerageValue) / 100) : toNumber(p.brokerageValue);
  const tax = toNumber(p.taxAmount);
  return Math.max(0, gross - brokerage - tax);
};
