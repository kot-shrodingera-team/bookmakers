import setStakeSumGeneratorOptions from '../../bookmakers/template/worker_callbacks/setStakeSumGeneratorOptions';
import setStakeSumGenerator, {
  clearStakeSumGenerator,
} from '../../utils/generators/worker_callbacks/setStakeSumGenerator';

const setStakeSum = setStakeSumGenerator(setStakeSumGeneratorOptions);

export const clearStakeSum = clearStakeSumGenerator(
  setStakeSumGeneratorOptions,
);

export default setStakeSum;
