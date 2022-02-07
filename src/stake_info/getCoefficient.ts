import getCoefficientGeneratorOptions from '../../bookmakers/template/stake_info/getCoefficientGeneratorOptions';
import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '../../utils/generators/stake_info/getStakeInfoValueGenerator';

const getCoefficient = getStakeInfoValueGenerator(
  getCoefficientGeneratorOptions,
);

export const coefficientReady = stakeInfoValueReadyGenerator(
  getCoefficientGeneratorOptions,
);

export default getCoefficient;
