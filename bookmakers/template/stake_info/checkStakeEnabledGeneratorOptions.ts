import { CheckStakeEnabledGeneratorOptions } from '../../../utils/generators/stake_info/checkStakeEnabledGenerator';
import getStakeCount from '../../../src/stake_info/getStakeCount';

const preCheck = (): boolean => {
  return true;
};

const checkStakeEnabledGeneratorOptions: CheckStakeEnabledGeneratorOptions = {
  preCheck,
  getStakeCount,
  betCheck: {
    selector: '',
    errorClasses: [
      {
        className: '',
        message: '',
      },
    ],
  },
  errorsCheck: [
    {
      selector: '',
      message: '',
    },
  ],
  context: () => document,
};

export default checkStakeEnabledGeneratorOptions;
