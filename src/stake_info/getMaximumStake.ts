import getMaximumStakeGeneratorOptions from '../../bookmakers/template/stake_info/getMaximumStakeGeneratorOptions';
import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '../../utils/generators/stake_info/getStakeInfoValueGenerator';

const getMaximumStake = getStakeInfoValueGenerator(
  getMaximumStakeGeneratorOptions,
);

export const maximumStakeReady = stakeInfoValueReadyGenerator(
  getMaximumStakeGeneratorOptions,
);

export default getMaximumStake;
