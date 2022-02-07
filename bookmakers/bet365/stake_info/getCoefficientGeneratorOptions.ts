import { text } from '../../../utils';
import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

export const coefficientSelector =
  // '.bss-NormalBetItem .bs-OddsLabel, .lbs-NormalBetItem .lbl-OddsLabel';
  '.lbl-OddsLabel, .bs-OddsLabel';

const getCoefficientText = () => {
  if (window.germesData.additionalFields.preparedBet) {
    const betButtonChildren = [
      ...window.germesData.additionalFields.preparedBet.children,
    ];
    const oddsChild = betButtonChildren.find((element) =>
      [...element.classList].some((_class) => _class.endsWith('Odds')),
    );
    if (!oddsChild) {
      return '0';
    }
    return text(oddsChild);
  }
  const couponCoefficient = document.querySelector(coefficientSelector);
  return text(couponCoefficient);
};

const getCoefficientGeneratorOptions: StakeInfoValueOptions = {
  name: 'coefficient',
  // fixedValue: () => 0,
  valueFromText: {
    text: {
      getText: getCoefficientText,
      // selector: coefficientSelector,
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

export default getCoefficientGeneratorOptions;
