import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

// sports, esports
export const coefficientSelector = ' .oddsText, .fD8Qg';

const getCoefficientGeneratorOptions: StakeInfoValueOptions = {
  name: 'coefficient',
  // fixedValue: () => 0,
  valueFromText: {
    text: {
      // getText: () => '',
      selector: coefficientSelector,
      context: () =>
        window.germesData.additionalFields.bettingFrame.contentDocument,
    },
    replaceDataArray: [
      {
        searchValue: ',',
        replaceValue: '.',
      },
    ],
    // removeRegex: /[\s,']/g,
    // matchRegex: /(\d+(?:\.\d+)?)/,
    errorValue: 0,
  },
  // zeroValues: [],
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // modifyValue: (value: number, extractType: string) => value,
  // disableLog: false,
};

export default getCoefficientGeneratorOptions;
