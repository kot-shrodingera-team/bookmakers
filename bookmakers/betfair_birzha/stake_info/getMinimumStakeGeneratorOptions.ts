import { round } from '../../../utils';
import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';
import getRawCoefficient from '../helpers/getRawCoefficient';

export const minimumStakeSelector = '';

const getMinimumStakeGeneratorOptions: StakeInfoValueOptions = {
  name: 'minimumStake',
  fixedValue: () => {
    const minimumBackStake = 1;
    if (window.germesData.additionalFields.isLay) {
      const rawCoefficient = getRawCoefficient();
      return round(minimumBackStake * (rawCoefficient - 1));
    }
    return minimumBackStake;
  },
  // valueFromText: {
  //   text: {
  //     // getText: () => '',
  //     selector: minimumStakeSelector,
  //     context: () => document,
  //   },
  //   replaceDataArray: [
  //     {
  //       searchValue: '',
  //       replaceValue: '',
  //     },
  //   ],
  //   removeRegex: /[\s,']/g,
  //   matchRegex: /(\d+(?:\.\d+)?)/,
  //   errorValue: 0,
  // },
  // zeroValues: [],
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // modifyValue: (value: number, extractType: string) => value,
  // disableLog: false,
};

export default getMinimumStakeGeneratorOptions;
