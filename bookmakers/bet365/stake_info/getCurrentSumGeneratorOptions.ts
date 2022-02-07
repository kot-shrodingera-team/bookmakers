import { text } from '../../../utils';
import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

export const sumInputSelector =
  // 'input.bss-StakeBox_StakeValueInput, input.lbs-StakeBox_StakeValueInput';
  '.lqb-StakeBox_StakeValue-input, .bsf-StakeBox_StakeValue-input';

const getCurrentSumText = () => {
  if (window.germesData.additionalFields.preparedBet) {
    return '';
  }
  const couponCoefficient = document.querySelector(sumInputSelector);
  return text(couponCoefficient);
};

const getCurrentSumGeneratorOptions: StakeInfoValueOptions = {
  name: 'currentSum',
  // fixedValue: () => 0,
  valueFromText: {
    text: {
      getText: getCurrentSumText,
      // selector: sumInputSelector,
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
  zeroValues: ['Stake', 'Puntata', ''],
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // modifyValue: (value: number, extractType: string) => value,
  // disableLog: false,
};

export default getCurrentSumGeneratorOptions;
