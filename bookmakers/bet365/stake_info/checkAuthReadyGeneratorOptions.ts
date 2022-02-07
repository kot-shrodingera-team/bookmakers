import { CheckAuthReadyGeneratorOptions } from '../../../utils/generators/stake_info/checkAuthReadyGenerator';

export const noAuthElementSelector = '.hm-MainHeaderRHSLoggedOutWide_Login';
export const authElementSelector = '.hm-MainHeaderMembersWide';

const checkAuthReadyGeneratorOptions: CheckAuthReadyGeneratorOptions = {
  noAuthElementSelector,
  authElementSelector,
  // maxDelayAfterNoAuthElementAppeared: 0,
  // context: () => document,
};

export default checkAuthReadyGeneratorOptions;
