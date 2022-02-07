import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

export const maximumStakeSelector = '';

const getMaximumStakeGeneratorOptions: StakeInfoValueOptions = {
  name: 'maximumStake',
  // fixedValue: () => getBalance(),
  valueFromText: {
    text: {
      // getText: () => '',
      selector: maximumStakeSelector,
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

export default getMaximumStakeGeneratorOptions;
