import { CheckStakeEnabledGeneratorOptions } from '../../../utils/generators/stake_info/checkStakeEnabledGenerator';
import getStakeCount from '../../../src/stake_info/getStakeCount';

// const preCheck = (): boolean => {
//   return true;
// };

const checkStakeEnabledGeneratorOptions: CheckStakeEnabledGeneratorOptions = {
  // preCheck,
  getStakeCount,
  betCheck: {
    selector: '.mv-bet-button.selected',
    errorClasses: [
      {
        className: 'empty',
        message: 'нет предложений',
      },
    ],
  },
  // errorsCheck: [
  //   {
  //     selector: '',
  //     message: '',
  //   },
  // ],
  // context: () => document,
};

export default checkStakeEnabledGeneratorOptions;
