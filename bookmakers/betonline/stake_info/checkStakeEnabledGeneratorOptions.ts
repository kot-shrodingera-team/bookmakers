import { CheckStakeEnabledGeneratorOptions } from '../../../utils/generators/stake_info/checkStakeEnabledGenerator';
import getStakeCount from '../../../src/stake_info/getStakeCount';

// const preCheck = (): boolean => {
//   return true;
// };

const checkStakeEnabledGeneratorOptions: CheckStakeEnabledGeneratorOptions = {
  // preCheck,
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
      selector: '.betErrors .imgFreeze',
      message: 'freeze',
    },
    // {
    //   selector: '#btnPostOne:not(.enabled)',
    //   message: 'кнопка ставки недоступна',
    // },
  ],
  // context: () => document,
};

export default checkStakeEnabledGeneratorOptions;
