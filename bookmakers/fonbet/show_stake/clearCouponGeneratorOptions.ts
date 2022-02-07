import { ClearCouponGeneratorOptions } from '../../../utils/generators/show_stake/clearCouponGenerator';
import getStakeCount from '../../../src/stake_info/getStakeCount';

// const preCheck = async (): Promise<boolean> => {
//   return true;
// };

const apiClear = (): void => {
  window.app.couponManager.newCoupon.clear();
};

// const postCheck = async (): Promise<boolean> => {
//   return true;
// };

const clearCouponGeneratorOptions: ClearCouponGeneratorOptions = {
  // preCheck,
  getStakeCount,
  apiClear,
  // clearSingleSelector: '',
  // clearAllSelector: '',
  // postCheck,
  // context: () => document,
};

export default clearCouponGeneratorOptions;
