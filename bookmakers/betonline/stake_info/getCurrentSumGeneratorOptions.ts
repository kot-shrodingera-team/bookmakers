import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

// sports, esports
export const sumInputSelector = 'input.txtBetAmt, input.GONQC';

const getCurrentSumGeneratorOptions: StakeInfoValueOptions = {
  name: 'currentSum',
  // fixedValue: () => 0,
  valueFromText: {
    text: {
      // getText: () => '',
      selector: sumInputSelector,
      context: () =>
        window.germesData.additionalFields.bettingFrame.contentDocument,
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
  // modifyValue: (value: number, extractType: string) => value,
  // disableLog: false,
};

export default getCurrentSumGeneratorOptions;
