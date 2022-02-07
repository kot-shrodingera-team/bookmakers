import { CheckStakeEnabledGeneratorOptions } from '../../../utils/generators/stake_info/checkStakeEnabledGenerator';
import getStakeCount from '../../../src/stake_info/getStakeCount';

// const preCheck = (): boolean => {
//   return true;
// };

const checkStakeEnabledGeneratorOptions: CheckStakeEnabledGeneratorOptions = {
  // preCheck,
  getStakeCount,
  betCheck: {
    selector: '.event-bets-list > .single',
    errorClasses: [
      {
        className: 'ui-disabled', // ui-market-closed ui-disabled not-selectable
        message: '',
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
