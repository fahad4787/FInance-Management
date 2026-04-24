const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Brokerage in dollars (same gross basis as tax: hours × rate). */
export const computeProjectBrokerageDollars = (p) => {
  const hours = toNumber(p.totalMonthlyHours);
  const rate = toNumber(p.hourlyRate);
  const gross = hours * rate;
  const isPercentage = (p.brokerageType || 'percentage') === 'percentage';
  return isPercentage ? gross * (toNumber(p.brokerageValue) / 100) : toNumber(p.brokerageValue);
};

/** Tax in dollars for allocation (same basis as gross: hours × rate). */
export const computeProjectTaxDollars = (p) => {
  const hours = toNumber(p.totalMonthlyHours);
  const rate = toNumber(p.hourlyRate);
  const gross = hours * rate;
  if (p.taxType === 'percentage') {
    return gross * (toNumber(p.taxValue) / 100);
  }
  if (p.taxType === 'fixed') {
    return toNumber(p.taxValue);
  }
  return toNumber(p.taxAmount);
};

/** Form defaults when editing or copying from an existing project. */
export const getTaxFormDefaultsFromProject = (project) => {
  if (!project) return { taxType: 'percentage', taxValue: '' };
  if (project.taxType === 'percentage' || project.taxType === 'fixed') {
    return {
      taxType: project.taxType,
      taxValue: project.taxValue ?? ''
    };
  }
  const legacy = project.taxAmount;
  if (legacy !== '' && legacy != null && Number(legacy) !== 0) {
    return { taxType: 'fixed', taxValue: String(legacy) };
  }
  return { taxType: 'percentage', taxValue: '' };
};

/** Persist computed taxAmount ($) for reporting; keep taxType + taxValue for the form. */
export const prepareProjectForFirestore = (values) => {
  const taxAmount = Number(computeProjectTaxDollars(values).toFixed(2));
  const out = { ...values, taxAmount };
  const pc = values.projectCost;
  if (pc === '' || pc == null) {
    out.projectCost = null;
  } else {
    const n = Number(pc);
    out.projectCost = Number.isFinite(n) ? Number(n.toFixed(2)) : null;
  }
  return out;
};

export const getProjectMonthlyAllocationAmount = (p) => {
  const hours = toNumber(p.totalMonthlyHours);
  const rate = toNumber(p.hourlyRate);
  const gross = hours * rate;
  const brokerage = computeProjectBrokerageDollars(p);
  const tax = computeProjectTaxDollars(p);
  return Math.max(0, gross - brokerage - tax);
};
