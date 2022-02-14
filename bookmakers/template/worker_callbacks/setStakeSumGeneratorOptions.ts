import getCurrentSum from '../../../src/stake_info/getCurrentSum';
import { SetStakeSumGeneratorOptions } from '../../../utils/generators/worker_callbacks/setStakeSumGenerator';
import { sumInputSelector } from '../stake_info/getCurrentSumGeneratorOptions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const preCheck = async (sum: number): Promise<boolean> => {
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const preInputCheck = (sum: number): boolean => {
  return true;
};

const setStakeSumGeneratorOptions: SetStakeSumGeneratorOptions = {
  preCheck,
  sumInputSelector,
  alreadySetCheck: {
    getCurrentSum,
    falseOnSumChange: false,
  },
  preInputCheck,
  inputType: 'fireEvent' as 'fireEvent' | 'react' | 'nativeInput',
  fireEventNames: ['input'],
  context: () => document,
};

export default setStakeSumGeneratorOptions;
