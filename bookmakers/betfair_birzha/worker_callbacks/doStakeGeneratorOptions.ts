import getCoefficient from '../../../src/stake_info/getCoefficient';
import getParameter from '../../../src/stake_info/getParameter';
import { germesLog, LogType } from '../../../utils';
import { DoStakeGeneratorOptions } from '../../../utils/generators/worker_callbacks/doStakeGenerator';
import setCoefficient from '../helpers/setCoefficient';

const preCheck = (): boolean => {
  const doStakeButton = document.querySelector(
    '[on-click="$ctrl.onPlaceBetsClick()"] button[type="submit"]',
  );
  if (!doStakeButton) {
    germesLog('Не найдена кнопка ставки', LogType.ERROR);
    return false;
  }
  if (doStakeButton.getAttribute('disabled')) {
    germesLog('Кнопка ставки недоступна', LogType.ERROR);
    return false;
  }
  // Перед ставкой устанавливаем коэффициент на тот, что был в момент считывания StakeInfo
  setCoefficient(window.germesData.additionalFields.rawCoefficient);

  // Для тестов отмены ставок
  // if (window.germesData.additionalFields.isLay) {
  //   setCoefficient(1.01);
  // } else {
  //   setCoefficient(10);
  // }
  return true;
};

// const apiMethod = (): boolean => {
//   return true;
// };

// const postCheck = (): boolean => {
//   return true;
// };

const doStakeGeneratorOptions: DoStakeGeneratorOptions = {
  preCheck,
  doStakeButtonSelector:
    '[on-click="$ctrl.onPlaceBetsClick()"] button[type="submit"]',
  // apiMethod,
  // errorClasses: [
  //   {
  //     className: '',
  //     message: '',
  //   },
  // ],
  disabledCheck: false,
  getCoefficient,
  getParameter,
  // postCheck,
  // context: () => document,
};

export default doStakeGeneratorOptions;
