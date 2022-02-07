import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

export const minimumStakeSelector = '';

const getMinimumStakeGeneratorOptions: StakeInfoValueOptions = {
  name: 'minimumStake',
  // fixedValue: () => 0,
  valueFromText: {
    text: {
      // getText: () => '',
      selector: minimumStakeSelector,
      context: () => document,
    },
    replaceDataArray: [
      {
        searchValue: '',
        replaceValue: '',
      },
    ],
    removeRegex: /[\s,']/g,
    matchRegex: /(\d+(?:\.\d+)?)/,
    errorValue: 0,
  },
  zeroValues: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  modifyValue: (value: number, extractType: string) => value,
  disableLog: false,
};

export default getMinimumStakeGeneratorOptions;
