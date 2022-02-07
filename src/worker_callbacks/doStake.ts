import doStakeGeneratorOptions from '../../bookmakers/template/worker_callbacks/doStakeGeneratorOptions';
import doStakeGenerator from '../../utils/generators/worker_callbacks/doStakeGenerator';

const doStake = doStakeGenerator(doStakeGeneratorOptions);

export default doStake;
