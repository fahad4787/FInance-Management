import { normalizeDateToYYYYMMDD } from './date';

const compareText = (a, b) =>
  String(a || '').localeCompare(String(b || ''), undefined, { sensitivity: 'base' });

const compareDatesAsc = (aYmd, bYmd) => {
  if (aYmd === bYmd) return 0;
  if (!aYmd) return 1;
  if (!bYmd) return -1;
  return aYmd.localeCompare(bYmd);
};

export const compareTransactions = (a, b) => {
  const dateCmp = compareDatesAsc(
    normalizeDateToYYYYMMDD(a?.date),
    normalizeDateToYYYYMMDD(b?.date)
  );
  if (dateCmp !== 0) return dateCmp;
  const clientCmp = compareText(a?.client, b?.client);
  if (clientCmp !== 0) return clientCmp;
  return compareText(a?.project, b?.project);
};

export const compareExpenses = (a, b) => {
  const dateCmp = compareDatesAsc(
    normalizeDateToYYYYMMDD(a?.date),
    normalizeDateToYYYYMMDD(b?.date)
  );
  if (dateCmp !== 0) return dateCmp;
  return compareText(a?.expenseName, b?.expenseName);
};

export const compareWithdrawals = (a, b) => {
  const dateCmp = compareDatesAsc(
    normalizeDateToYYYYMMDD(a?.createdAt),
    normalizeDateToYYYYMMDD(b?.createdAt)
  );
  if (dateCmp !== 0) return dateCmp;
  return compareText(a?.description, b?.description);
};
