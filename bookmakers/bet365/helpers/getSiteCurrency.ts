const getSiteCurrency = (): string => {
  if (
    !window.Locator ||
    !window.Locator.user ||
    !window.Locator.user.currencyCode
  ) {
    return 'Unknown';
  }
  const { currencyCode } = window.Locator.user;
  if (currencyCode === 'EUR') {
    return 'EUR';
  }
  if (currencyCode === 'USD') {
    return 'USD';
  }
  if (currencyCode === 'RUB') {
    return 'RUR';
  }
  if (currencyCode === 'INR') {
    return 'INR';
  }
  if (currencyCode === 'GBP') {
    return 'GBP';
  }
  return 'Unknown';
};

export default getSiteCurrency;
