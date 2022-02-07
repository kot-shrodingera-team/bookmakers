import { CheckAuthReadyGeneratorOptions } from '../../../utils/generators/stake_info/checkAuthReadyGenerator';

export const noAuthElementSelector = '.header__login-head a.header-btn';
export const authElementSelector = '.header__login-label';

const checkAuthReadyGeneratorOptions: CheckAuthReadyGeneratorOptions = {
  noAuthElementSelector,
  authElementSelector,
  // maxDelayAfterNoAuthElementAppeared: 0,
  // context: () => document,
};

export default checkAuthReadyGeneratorOptions;
