export const formatMoney = (amount, currencyCode = 'USD') => {
  let locale = 'en-US';
  if (currencyCode === 'PKR') locale = 'en-PK';
  else if (currencyCode === 'EUR') locale = 'en-IE';
  else if (currencyCode === 'GBP') locale = 'en-GB';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/** Local calendar YYYY-MM (avoids UTC day-boundary shift from toISOString). */
export const toYearMonthLocal = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/** Local calendar YYYY-MM-DD for date inputs. */
export const toDateInputLocal = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
