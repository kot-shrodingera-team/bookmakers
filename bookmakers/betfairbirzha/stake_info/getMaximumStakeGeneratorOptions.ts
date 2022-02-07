import { germesLog, LogType, round } from '../../../utils';
import { StakeInfoValueOptions } from '../../../utils/generators/stake_info/getStakeInfoValueGenerator';
import getRawCoefficient from '../helpers/getRawCoefficient';

export const maximumStakeSelector = '';

const getMaximumStakeGeneratorOptions: StakeInfoValueOptions = {
  name: 'maximumStake',
  fixedValue: () => {
    const currentStakeButton = document.querySelector(
      '.mv-bet-button.selected',
    );
    if (!currentStakeButton) {
      germesLog(
        'Ошибка получения максимальной ставки: Нет текущей ставки',
        LogType.ERROR,
      );
      return -1;
    }
    const size = currentStakeButton.getAttribute('size');
    if (!size) {
      germesLog(
        'Ошибка получения максимальной ставки: Не найден аттрибут максимальной ставки',
        LogType.ERROR,
      );
      return -1;
    }
    const rawMax = Number(size.substring(1));
    if (!rawMax) {
      germesLog(
        `Ошибка получения максимальной ставки: Не удалось спарсить - ${size}`,
        LogType.ERROR,
      );
      return -1;
    }
    if (window.germesData.additionalFields.isLay) {
      const rawCoefficient = getRawCoefficient();
      return round(rawMax * (rawCoefficient - 1));
    }
    return rawMax;
  },
  // valueFromText: {
  //   text: {
  //     // getText: () => '',
  //     selector: maximumStakeSelector,
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

export default getMaximumStakeGeneratorOptions;
