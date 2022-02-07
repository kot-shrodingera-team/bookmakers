import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';

// export const balanceSelector = '.hm-Balance';

const getBalanceGeneratorOptions: StakeInfoValueOptions = {
  name: 'balance',
  fixedValue: () => {
    // eslint-disable-next-line no-underscore-dangle
    if (window.Locator.user._balance.totalBalance === undefined) {
      return null;
    }
    return (
      // eslint-disable-next-line no-underscore-dangle
      Number(window.Locator.user._balance.totalBalance) -
      // eslint-disable-next-line no-underscore-dangle
      Number(window.Locator.user._balance.bonusBalance)
    );
  },
  // valueFromText: {
  //   text: {
  //     // getText: () => '',
  //     selector: balanceSelector,
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

export const preUpdateBalance = () => {
  // eslint-disable-next-line no-underscore-dangle
  window.Locator.user._balance.refreshBalance();
};

export default getBalanceGeneratorOptions;
