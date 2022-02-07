import getCoefficient from '../../../src/stake_info/getCoefficient';
import { DoStakeGeneratorOptions } from '../../../utils/generators/worker_callbacks/doStakeGenerator';

// const preCheck = (): boolean => {
//   return true;
// };

// const apiMethod = (): boolean => {
//   return true;
// };

// const postCheck = (): boolean => {
//   return true;
// };

const doStakeGeneratorOptions: DoStakeGeneratorOptions = {
  // preCheck,
  doStakeButtonSelector: '.betslip-container-real .place-bets-button',
  // apiMethod,
  errorClasses: [
    {
      className: 'ui-disabled',
      message: '',
    },
  ],
  // disabledCheck: false,
  getCoefficient,
  // postCheck,
  // context: () => document,
};

export default doStakeGeneratorOptions;
