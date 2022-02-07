import checkStakeStatusGeneratorOptions from '../../bookmakers/template/worker_callbacks/checkStakeStatusGeneratorOptions';
import checkStakeStatusGenerator from '../../utils/generators/worker_callbacks/checkStakeStatusGenerator';

const checkStakeStatus = checkStakeStatusGenerator(
  checkStakeStatusGeneratorOptions,
);

export default checkStakeStatus;
