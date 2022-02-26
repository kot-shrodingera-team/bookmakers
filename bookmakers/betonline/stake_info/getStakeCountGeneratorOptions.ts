import { GetStakeCountGeneratorOptions } from '../../../utils/generators/stake_info/getStakeCountGenerator';

// sports, esports
const stakeSelector = '.bsBet, .I2MdV';

const getStakeCountGeneratorOptions: GetStakeCountGeneratorOptions = {
  // function: () => 0,
  stakeSelector,
  context: () =>
    window.germesData.additionalFields.bettingFrame.contentDocument,
};

export default getStakeCountGeneratorOptions;
