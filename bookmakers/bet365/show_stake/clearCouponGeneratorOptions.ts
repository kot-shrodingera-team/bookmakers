import { ClearCouponGeneratorOptions } from '../../../utils/generators/show_stake/clearCouponGenerator';
import getStakeCount from '../../../src/stake_info/getStakeCount';
import { getWorkerParameter } from '../../../utils';

// const preCheck = async (): Promise<boolean> => {
//   return true;
// };

const apiClear = (): void => {
  window.BetSlipLocator.betSlipManager.deleteAllBets();
};

// const postCheck = async (): Promise<boolean> => {
//   return true;
// };

const useAPI =
  getWorkerParameter('useClearCouponAPI') === undefined
    ? true
    : getWorkerParameter('useClearCouponAPI');

const clearCouponGeneratorOptions: ClearCouponGeneratorOptions = useAPI
  ? {
      // preCheck,
      getStakeCount,
      apiClear,
      // clearSingleSelector: '',
      // clearAllSelector: '',
      // postCheck,
      // context: () => document,
    }
  : {
      // preCheck,
      getStakeCount,
      // apiClear,
      clearSingleSelector:
        '.lbl-DeleteButton_DeleteIcon, .bss-NormalBetItem_Remove',
      clearAllSelector: '',
      // postCheck,
      // context: () => document,
    };

export default clearCouponGeneratorOptions;
