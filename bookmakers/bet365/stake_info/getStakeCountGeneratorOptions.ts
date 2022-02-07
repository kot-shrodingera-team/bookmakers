import { GetStakeCountGeneratorOptions } from '../../../utils/generators/stake_info/getStakeCountGenerator';

// const stakeSelector = '';

const getStakeCountGeneratorOptions: GetStakeCountGeneratorOptions = {
  function: () => {
    if (window.germesData.additionalFields.preparedBet) {
      return 1;
    }
    return window.BetSlipLocator.betSlipManager.getBetCount();
  },
  // stakeSelector,
  // context: () => document,
};

export default getStakeCountGeneratorOptions;
