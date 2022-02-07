import { getWorkerParameter } from '../../../utils';
import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

export const maximumStakeSelector =
  '[class*="_min-max"] [class*="info-block__value"]:nth-child(3)';

const getMaximumStakeGeneratorOptions: StakeInfoValueOptions = {
  name: 'maximumStake',
  // fixedValue: () => getBalance(),
  valueFromText: {
    text: {
      // getText: () => '',
      selector: maximumStakeSelector,
      // context: () => document,
    },
    // replaceDataArray: [
    //   {
    //     searchValue: '',
    //     replaceValue: '',
    //   },
    // ],
    // removeRegex: /[\s,']/g,
    // matchRegex: /(\d+(?:\.\d+)?)/,
    errorValue: 0,
  },
  // zeroValues: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  modifyValue: (value: number, extractType: string) => {
    if (getWorkerParameter('dontModifyMaximumStake')) {
      return value;
    }
    if (worker.Currency === 'RUR') {
      if (value >= 200) {
        return value - 100;
      }
    }
    return value;
  },
  // disableLog: false,
};

export default getMaximumStakeGeneratorOptions;
