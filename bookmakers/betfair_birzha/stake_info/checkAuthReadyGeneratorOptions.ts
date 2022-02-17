import { CheckAuthReadyGeneratorOptions } from '../../../utils/generators/stake_info/checkAuthReadyGenerator';

export const noAuthElementSelector = '#ssc-hw:not(.isLoggedIn)';
export const authElementSelector = '#ssc-hw.isLoggedIn';

const checkAuthReadyGeneratorOptions: CheckAuthReadyGeneratorOptions = {
  noAuthElementSelector,
  authElementSelector,
  maxDelayAfterNoAuthElementAppeared: 1000,
  // context: () => document,
};

export default checkAuthReadyGeneratorOptions;
