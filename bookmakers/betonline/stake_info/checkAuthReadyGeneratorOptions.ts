import { CheckAuthReadyGeneratorOptions } from '../../../utils/generators/stake_info/checkAuthReadyGenerator';

export const noAuthElementSelector = '.layout-auth-nav';
export const authElementSelector = '.logged-inheader-comp';

const checkAuthReadyGeneratorOptions: CheckAuthReadyGeneratorOptions = {
  noAuthElementSelector,
  authElementSelector,
  maxDelayAfterNoAuthElementAppeared: 0,
  context: () => document,
};

export default checkAuthReadyGeneratorOptions;
