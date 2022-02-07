import getCurrentSumGeneratorOptions from '../../bookmakers/template/stake_info/getCurrentSumGeneratorOptions';
import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '../../utils/generators/stake_info/getStakeInfoValueGenerator';

const getCurrentSum = getStakeInfoValueGenerator(getCurrentSumGeneratorOptions);

export const currentSumReady = stakeInfoValueReadyGenerator(
  getCurrentSumGeneratorOptions,
);

export default getCurrentSum;
