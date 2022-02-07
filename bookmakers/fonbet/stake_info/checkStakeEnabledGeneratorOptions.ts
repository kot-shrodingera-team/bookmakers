import { CheckStakeEnabledGeneratorOptions } from '../../../utils/generators/stake_info/checkStakeEnabledGenerator';
import getStakeCount from '../../../src/stake_info/getStakeCount';
import { checkAccountBlocked, accountBlocked } from '../helpers/accountChecks';

const preCheck = (): boolean => {
  if (checkAccountBlocked()) {
    accountBlocked();
    return false;
  }
  return true;
};

const checkStakeEnabledGeneratorOptions: CheckStakeEnabledGeneratorOptions = {
  preCheck,
  getStakeCount,
  // betCheck: {
  //   selector: '',
  //   errorClasses: [
  //     {
  //       className: '',
  //       message: '',
  //     },
  //   ],
  // },
  errorsCheck: [
    {
      selector: '[class*="overlay-unavailable"]',
      // message: '',
    },
    {
      selector:
        'tr[class*="stake-wide--"] > td[class*="column2--"][class*="_blocked--"]',
      message: 'заблокирована',
    },
  ],
  // context: () => document,
};

export default checkStakeEnabledGeneratorOptions;
