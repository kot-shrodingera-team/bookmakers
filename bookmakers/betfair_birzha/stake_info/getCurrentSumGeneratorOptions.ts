import { round } from '../../../utils';
import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

export const sumInputSelector = '.betslip-size-input';

const getCurrentSumGeneratorOptions: StakeInfoValueOptions = {
  name: 'currentSum',
  // fixedValue: () => 0,
  valueFromText: {
    text: {
      // getText: () => '',
      selector: sumInputSelector,
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
  zeroValues: [''],
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  modifyValue: (value: number /* , extractType: string */) => {
    return window.germesData.additionalFields.isLay
      ? round(value / (window.germesData.additionalFields.rawCoefficient - 1))
      : value;
  },
  // disableLog: false,
};

export default getCurrentSumGeneratorOptions;
