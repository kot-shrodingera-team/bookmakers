import { text } from '../../../utils';

const getSiteCurrency = (): string => {
  const balanceElement = document.querySelector('.ssc-wla[rel="main"]');
  if (!balanceElement) {
    return 'Unknown';
  }

  const balance = text(balanceElement);

  if (/^€.*$/.test(balance)) {
    return 'EUR';
  }

  if (/^\$.*$/.test(balance)) {
    return 'USD';
  }

  return 'Unknown';
};

export default getSiteCurrency;
