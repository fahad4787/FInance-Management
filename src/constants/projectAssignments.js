const toSortedOptions = (names) =>
  [...names]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((label) => ({ value: label, label }));

export const LEAD_OPTIONS = toSortedOptions(['Abrar', 'Hammad', 'Shahzaib']);

export const PROJECT_MANAGER_OPTIONS = toSortedOptions(['Arsal', 'Abrar', 'Shahzaib', 'Hammad']);

export const PERSON_BADGE_COLORS = {
  Abrar: 'bg-sky-100 text-sky-800',
  Arsal: 'bg-teal-100 text-teal-800',
  Hammad: 'bg-violet-100 text-violet-800',
  Shahzaib: 'bg-amber-100 text-amber-800'
};
