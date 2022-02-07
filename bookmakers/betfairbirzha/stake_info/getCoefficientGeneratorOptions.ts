import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';
import commissionCoefficient from '../helpers/commissionCoefficient';
import getRawCoefficient from '../helpers/getRawCoefficient';
import invertCoefficient from '../helpers/invertCoefficient';

// export const coefficientSelector = '.mv-bet-button.selected .bet-button-price';

const getCoefficientGeneratorOptions: StakeInfoValueOptions = {
  name: 'coefficient',
  fixedValue: () => {
    let coefficient = getRawCoefficient();
    if (window.germesData.additionalFields.isLay) {
      coefficient = invertCoefficient(coefficient);
    }
    return commissionCoefficient(coefficient);
  },
  // valueFromText: {
  //   text: {
  //     // getText: () => '',
  //     selector: coefficientSelector,
  //     // context: () => document,
  //   },
  //   // replaceDataArray: [
  //   //   {
  //   //     searchValue: '',
  //   //     replaceValue: '',
  //   //   },
  //   // ],
  //   // removeRegex: /[\s,']/g,
  //   // matchRegex: /(\d+(?:\.\d+)?)/,
  //   errorValue: 0,
  // },
  // zeroValues: [],
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // modifyValue: (value: number, extractType: string) => value,
  // disableLog: false,
};

export default getCoefficientGeneratorOptions;
