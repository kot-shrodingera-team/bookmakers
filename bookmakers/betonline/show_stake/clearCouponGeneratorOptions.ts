import { ClearCouponGeneratorOptions } from '../../../utils/generators/show_stake/clearCouponGenerator';
import getStakeCount from '../../../src/stake_info/getStakeCount';

// const preCheck = async (): Promise<boolean> => {
//   return true;
// };

// const apiClear = (): void => {};

// const postCheck = async (): Promise<boolean> => {
//   return true;
// };

const clearCouponGeneratorOptions: ClearCouponGeneratorOptions = {
  // preCheck,
  getStakeCount,
  // apiClear,
  clearSingleSelector: '.YXgQC div', // esports
  // clearAllSelector: '',
  // postCheck,
  context: () =>
    window.germesData.additionalFields.bettingFrame.contentDocument,
};

export default clearCouponGeneratorOptions;
