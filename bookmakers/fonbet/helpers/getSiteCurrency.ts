import { getWorkerParameter } from '../../../utils';

const getSiteCurrency = (): string => {
  if (!getWorkerParameter('disableCurrencyCheck')) {
    return 'Unknown';
  }
  if (window.location.host === 'www.fonbet.ru') {
    return 'RUR';
  }
  return 'Unknown';
};

export default getSiteCurrency;
