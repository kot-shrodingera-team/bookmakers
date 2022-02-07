import getMinimumStakeGeneratorOptions from '../../bookmakers/template/stake_info/getMinimumStakeGeneratorOptions';
import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '../../utils/generators/stake_info/getStakeInfoValueGenerator';

const getMinimumStake = getStakeInfoValueGenerator(
  getMinimumStakeGeneratorOptions,
);

export const minimumStakeReady = stakeInfoValueReadyGenerator(
  getMinimumStakeGeneratorOptions,
);

export default getMinimumStake;
