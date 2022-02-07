import checkStakeEnabledGeneratorOptions from '../../bookmakers/template/stake_info/checkStakeEnabledGeneratorOptions';
import checkStakeEnabledGenerator from '../../utils/generators/stake_info/checkStakeEnabledGenerator';

const checkStakeEnabled = checkStakeEnabledGenerator(
  checkStakeEnabledGeneratorOptions,
);

export default checkStakeEnabled;
