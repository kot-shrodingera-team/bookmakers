// import getCurrentSum from '../../../src/stake_info/getCurrentSum';
import { SetStakeSumGeneratorOptions } from '../../../utils/generators/worker_callbacks/setStakeSumGenerator';
import preBetCheck from '../helpers/preBetCheck';
import { sumInputSelector } from '../stake_info/getCurrentSumGeneratorOptions';

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const preCheck = (sum: number): boolean => {
//   return true;
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const preInputCheck = (sum: number): boolean => {
  return preBetCheck();
};

const setStakeSumGeneratorOptions: SetStakeSumGeneratorOptions = {
  // preCheck,
  sumInputSelector,
  // alreadySetCheck: {
  //   getCurrentSum,
  //   falseOnSumChange: false,
  // },
  preInputCheck,
  inputType: 'react' as 'fireEvent' | 'react' | 'nativeInput',
  // fireEventNames: ['input'],
  // context: () => document,
};

export default setStakeSumGeneratorOptions;
