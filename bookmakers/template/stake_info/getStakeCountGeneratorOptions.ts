import { GetStakeCountGeneratorOptions } from '../../../utils/generators/stake_info/getStakeCountGenerator';

const stakeSelector = '';

const getStakeCountGeneratorOptions: GetStakeCountGeneratorOptions = {
  // function: () => 0,
  stakeSelector,
  context: () => document,
};

export default getStakeCountGeneratorOptions;
