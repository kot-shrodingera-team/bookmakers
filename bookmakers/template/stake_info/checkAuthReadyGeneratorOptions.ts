import { CheckAuthReadyGeneratorOptions } from '../../../utils/generators/stake_info/checkAuthReadyGenerator';

export const noAuthElementSelector = '';
export const authElementSelector = '';

const checkAuthReadyGeneratorOptions: CheckAuthReadyGeneratorOptions = {
  noAuthElementSelector,
  authElementSelector,
  maxDelayAfterNoAuthElementAppeared: 0,
  context: () => document,
};

export default checkAuthReadyGeneratorOptions;
