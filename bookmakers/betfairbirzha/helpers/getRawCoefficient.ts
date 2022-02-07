import getStakeInfoValueGenerator, {
  StakeInfoValueOptions,
} from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

export const rawCoefficientSelector =
  '.mv-bet-button.selected .bet-button-price';

const getRawCoefficientGeneratorOptions: StakeInfoValueOptions = {
  name: 'coefficient',
  // fixedValue: () => 0,
  valueFromText: {
    text: {
      // getText: () => '',
      selector: rawCoefficientSelector,
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
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // modifyValue: (value: number, extractType: string) => value,
  // disableLog: false,
};

const getRawCoefficient = getStakeInfoValueGenerator(
  getRawCoefficientGeneratorOptions,
);

export default getRawCoefficient;
