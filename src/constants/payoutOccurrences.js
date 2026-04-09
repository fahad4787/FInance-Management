export const PAYOUT_OCCURRENCE_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'weekly', label: 'Weekly' }
];

export const PAYOUT_OCCURRENCE_LABELS = PAYOUT_OCCURRENCE_OPTIONS.map((o) => o.label);

export const PAYOUT_OCCURRENCE_VALUE_BY_LABEL = PAYOUT_OCCURRENCE_OPTIONS.reduce((acc, o) => {
  acc[o.label] = o.value;
  return acc;
}, {});

export const PAYOUT_OCCURRENCE_LABEL_BY_VALUE = PAYOUT_OCCURRENCE_OPTIONS.reduce((acc, o) => {
  acc[o.value] = o.label;
  return acc;
}, {});

